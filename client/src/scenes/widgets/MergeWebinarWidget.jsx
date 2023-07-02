import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction"; // needed for eventClick
import { Box, Typography, Paper } from "@mui/material";
import { setWebinars, setWebinar } from 'state'; // Update this to point to your correct action
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { set } from 'date-fns';


const MergeWebinarWidget = () => {
  const dispatch = useDispatch();
  const webinars = useSelector((state) => state.webinars);
  const { mergeCoins, _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const selectedWebinar = useSelector((state) => state.webinar); // Update: Retrieve selectedWebinar from the Redux store
  const [enrolled, setEnrolled] = useState(false);
  const [dialogWebinar, setDialogWebinar] = useState(null); // Add dialogWebinar state

  const getWebinars = async () => {
    const response = await fetch("http://localhost:3001/mergeWebinars", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
  
    const formattedWebinars = data.map(webinar => {
      const isEnrolled = webinar.atendees.includes(_id);
      return {
        title: webinar.title,
        start: new Date(webinar.start).toISOString(),
        end: new Date(webinar.end).toISOString(),
        backgroundColor: isEnrolled ? 'green' : 'blue', // change color based on whether user is enrolled
        extendedProps: { // store additional fields
          description: webinar.description,
          price: webinar.price,
          atendees: webinar.atendees.map(id => id.toString()), // if userId is an array of ObjectIDs
          _id: webinar._id.toString(), // convert ObjectId to string
          isEnrolled: isEnrolled // store whether user is enrolled
        },
      };
    });
  
    dispatch(setWebinars(formattedWebinars));
  };
  

  const handleEventClick = (info) => {
    const clickedWebinar = webinars.find((webinar) => webinar.extendedProps._id === info.event.extendedProps._id);
    if (clickedWebinar) {
      dispatch(setWebinar(clickedWebinar));
      // add userId to response of setEnrolled
      // Check if the user is already enrolled if not enrolled, setEnrolled(false)
      setEnrolled(clickedWebinar.extendedProps.isEnrolled);
      // store the clicked webinar in the state and also add current user's id to the webinar's atendees array
      setDialogWebinar(clickedWebinar);
    }
  };
  
  
  const enrollInWebinar = async (webinar) => {
    try {
      const updatedMergeCoins = mergeCoins - webinar.extendedProps.price;
      console.log('updatedMergeCoins', updatedMergeCoins);
      console.log('webinar.extendedProps.price', webinar.extendedProps.price);
      console.log('mergeCoins', mergeCoins);
      console.log('webinar.extendedProps.atendees', webinar.extendedProps.atendees);
      console.log('webinar.extendedProps._id', webinar.extendedProps._id);
      if (updatedMergeCoins >= 0) {
        // Update: Add userId to the request body
        const enrollResponse = await fetch(`http://localhost:3001/mergeWebinars/enroll/${webinar.extendedProps._id}/${_id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (enrollResponse.ok) {
          console.log(`Enrolled in webinar: ${webinar.title}`);
          setEnrolled(true);

          const userResponse = await fetch(`http://localhost:3001/mergeWebinars/user/${_id}`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ mergeCoins: updatedMergeCoins }),
          });

          if (userResponse.ok) {
            console.log(`Updated user's merge coins to: ${updatedMergeCoins}`);
          } else {
            console.error('Failed to update user coins');
          }
        } else {
          console.error('Failed to enroll in webinar');
        }
      } else {
        console.error('Not enough merge coins to enroll in this webinar');
      }
    } catch (error) {
      console.error(`Failed to enroll in webinar: ${error}`);
    }
  };


  useEffect(() => {
    console.log('Webinars from Redux:', webinars);
    getWebinars();
  }, []); // Empty dependency array to run the effect once after component mounts





  return (
    <Box style={{ padding: "2rem", minHeight: "80vh" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={webinars}
        eventClick={handleEventClick}
      />
      <Dialog open={!!dialogWebinar} onClose={() => setDialogWebinar(null)}> {/* Update: Use setDialogWebinar(null) to close the dialog */}
        <DialogTitle>{selectedWebinar?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{selectedWebinar?.extendedProps.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setDialogWebinar(null)}>Close</Button> {/* Update: Use setDialogWebinar(null) to close the dialog */}
        {!enrolled && dialogWebinar && (
          // print dialogWebinar to console to see what it looks like
          console.log('dialogWebinar', dialogWebinar),
          <Button onClick={() => enrollInWebinar(dialogWebinar)}>Enroll</Button>
        )}
        {enrolled && dialogWebinar && (
          <Button onClick={() => window.open(dialogWebinar.extendedProps.zoomLink, '_blank')}>
            Open Zoom Link
          </Button>
        )}
      </DialogActions>

      </Dialog>
    </Box>
  );
};

export default MergeWebinarWidget;
