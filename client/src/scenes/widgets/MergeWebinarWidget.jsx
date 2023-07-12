import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction"; // needed for eventClick
import { Box, Typography, Paper } from "@mui/material";
import { setWebinars, setWebinar } from 'state'; // Update this to point to your correct action
import Dialog from '@mui/material/Dialog';
import Badge from '@mui/material/Badge';
import{ Paid } from "@mui/icons-material";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { set } from 'date-fns';
import { setUser, setUserWebinars } from "state";


const MergeWebinarWidget = () => {
  const dispatch = useDispatch();
  const webinars = useSelector((state) => state.webinars);
  const { mergeCoins, _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const selectedWebinar = useSelector((state) => state.webinar); // Update: Retrieve selectedWebinar from the Redux store
  const [enrolled, setEnrolled] = useState(false);
  // const [userWebinars, setUserWebinars] = useState([]);
  const [dialogWebinar, setDialogWebinar] = useState(null); // Add dialogWebinar state
  const [notEnoughCoins, setNotEnoughCoins] = useState(false); // State to track not enough coins warning
  const userWebinars = useSelector((state) => state.userWebinars);

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
          zoomLink: webinar.zoomLink,
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
        const curData = {mergeCoins: updatedMergeCoins};
        const mergeUserResponse = await fetch(`http://localhost:3001/mergeUsers/mergeCoins/${_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(curData), // we will send the form data as json
        });
        const mergeUser = await mergeUserResponse.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
        if (mergeUserResponse.ok) {
          dispatch(setUser({ user: mergeUser.user }));
          //TODO append current webinar to userWebinars in state
          dispatch(setUserWebinars([...userWebinars, webinar]));
          getWebinars();
        }
        // Update MergeCoins in Redux store
      } else {
        setNotEnoughCoins(true); // Show warning if not enough coins
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
      {/* FullCalendar component */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={webinars}
        eventClick={handleEventClick}
      />

      {/* Warning Dialog */}
      <Dialog open={notEnoughCoins} onClose={() => setNotEnoughCoins(false)}>
        <DialogTitle>Not Enough Merge Coins</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You don't have enough merge coins to enroll in this webinar.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotEnoughCoins(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Webinar Details Dialog */}
      <Dialog open={!!dialogWebinar} onClose={() => setDialogWebinar(null)}>
        <DialogTitle>{selectedWebinar?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{selectedWebinar?.extendedProps.description}</DialogContentText>
        </DialogContent>
        <DialogContentText sx={{ fontWeight: 'bold', mt:'0.5rem', ml: '2rem'}}>
            Date: {new Date(selectedWebinar?.start).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })}
          </DialogContentText>
        <DialogActions>
          <Button onClick={() => setDialogWebinar(null) } sx={{ fontSize: "14px", display: 'flex', gap: '3px' }} >Close</Button>
          {!enrolled && dialogWebinar && (
            <Button
              onClick={() => {
                if (mergeCoins >= dialogWebinar.extendedProps.price) {
                  enrollInWebinar(dialogWebinar);
                } else {
                  setNotEnoughCoins(true);
                }
              } } sx={{ fontSize: "14px", display: 'flex', gap: '3px' }}
            >
                <span style={{ textTransform: 'uppercase' }}>
                  <span style={{ textTransform: 'capitalize' }}>E</span>nroll
                </span>
              <Badge badgeContent={dialogWebinar.extendedProps.price} color="warning">
                <Paid sx={{ fontSize: "25px", marginLeft: "5px" }} />
              </Badge>
            </Button>
          )}
          {enrolled && dialogWebinar && (
            <Button onClick={() => window.open(dialogWebinar.extendedProps.zoomLink) } sx={{ fontSize: "14px", display: 'flex', gap: '3px' }}>
              Open
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MergeWebinarWidget;

