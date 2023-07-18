// MyWebinars.jsx
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, useTheme, Typography, List, ListItem, Link } from "@mui/material";
import { setUserWebinars } from "state";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


const MergeMyWebinarWidget = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  // const [userWebinars, setUserWebinars] = useState([]);
  const userWebinars = useSelector((state) => state.userWebinars);
  const [selectedWebinar, setSelectedWebinar] = useState(null);


  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  // open the dialog box when a webinar is selected
  const handleWebinarClick = (webinar) => {
    setSelectedWebinar(webinar);
  }

  // close the dialog box
  const handleClose = () => {
    setSelectedWebinar(null);
  }



  useEffect(() => {
    const getUserWebinars = async () => {
      try {
        const response = await fetch(`http://localhost:3001/mergeWebinars/userWebinars/${_id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        //setUserWebinars(data);
        dispatch(setUserWebinars(data));
      } catch (error) {
        console.error(`Failed to fetch user's webinars: ${error}`);
      }
    };
    getUserWebinars();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "0.5rem" }}
      >
        My Webinars
      </Typography>
      <Box>
        {userWebinars && userWebinars.length > 0 ? (
        <List>          
          {userWebinars.map((webinar) => (
            <ListItem
              key={webinar._id}
              onClick={() => handleWebinarClick(webinar)}
              variant="contained"
              color='primary'
              sx={{
                cursor: "pointer",
                "&:hover": {
                },
              }}
            >
              <Typography
                color={palette.primary}
                variant="h6"
                fontWeight="bold"
                sx={{ mb: "0.5rem", color: 'primary.main' }}
              >
                {webinar.title}
              </Typography>
            </ListItem>
          ))}    
        </List> ) : (
          <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          You don't have any webinars yet.
        </Typography> )}
      </Box>
      { selectedWebinar ? (
        <Dialog open={!!selectedWebinar} onClose={handleClose}>
          <DialogTitle>{selectedWebinar.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{selectedWebinar.description}</DialogContentText>
          </DialogContent>
          <DialogContentText sx={{ fontWeight: 'bold', mt: '0.5rem', ml: '2rem' }}>
            Date: {new Date(selectedWebinar.start).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })}
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleClose} sx={{ fontSize: "14px", display: 'flex', gap: '3px' }} color="primary">
              Close
            </Button>
            <Button onClick={() => window.open(selectedWebinar.zoomLink, "_blank")} sx={{ fontSize: "14px", display: 'flex', gap: '3px' }} color="primary">
              Open
            </Button>
          </DialogActions>
        </Dialog> ) : null}

    </WidgetWrapper>
  );
};

export default MergeMyWebinarWidget;
