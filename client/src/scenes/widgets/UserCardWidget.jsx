import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, Divider, Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import WidgetWrapper from 'components/WidgetWrapper';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Chip from '@mui/material/Chip';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { Rating } from "@mui/material";
import { setUser } from "state";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const UserCardWidget = ({userId}) => {
  const dispatch = useDispatch();
  const { palette, typography } = useTheme();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id); 
  const [user, setProfileUser] = useState(null);
  const loggedInUser = useSelector((state) => state.user);
  const [openRate, setOpenRate] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(loggedInUser.ratedUsers.indexOf(userId) !== -1);

  const userData = {
    name: user ? `${user.name} ${user.surname}` : '',
    profilePicture: user ? `http://localhost:3001/assets/${user.picturePath}` : '',
    trustPoints: user && user.trustPoints ? user.trustPoints : '?',
    websiteLink: user && user.webSiteLink ? user.webSiteLink : '',
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/mergeUsers/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileUser(data);
        } else {
          console.error('Error fetching user data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUser();
  }, [loggedInUser.ratedUsers.indexOf(userId), userData.trustPoints, token]);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleClickOpen = () => {
      setOpenRate(true);
  };

  const handleClose = () => {
    patchRating();
    setOpenRate(false);
  };

  const patchRating = async () => {
    const response = await fetch(`http://localhost:3001/mergeUsers/${userId}/rate`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, loggedInUserId }),
    });
    if(response.ok) {
      const updatedUser = await response.json();
      dispatch(setUser({ user: updatedUser }));
      setIsRated(true);
    }    
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginRight: '0.1rem',
    },
    chip: {
      fontSize: "0.8rem",
      padding: "0.3rem",
    },
  };

  return (
    <WidgetWrapper>
      <Box>
        <Box p={2} color={palette.text.primary} display="flex" justifyContent="center" marginBottom="1rem">
          {/* User Profile Image */}
          <img
            src={userData.profilePicture}
            alt="User Profile"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </Box>
        <Divider /> {/* Divider */}
        <Box p={2} color={palette.text.primary} textAlign="center">
          {/* User Name */}
          <Typography variant="h5" fontWeight="bold" marginBottom="0.5rem">
            {userData.name}
          </Typography>
          {/* User Points */}
          <Typography variant="body1" color="textSecondary" marginBottom="0.5rem">
            <div style={styles.container}>
              <MilitaryTechIcon fontSize="large" color="primary" style={styles.icon} />
              <Rating
                      name="widget-rating"
                      value={userData.trustPoints}
                      readOnly
                      size="medium"
                    />    
               <span style={{marginLeft: "0.5rem"}}>{userData.trustPoints}/5</span>
            </div>
            { !isRated && (
            <Box style={{ marginTop: '20px' }}>
                <Chip
                  icon={<ThumbsUpDownIcon />}
                  label="RATE THIS USER"
                  color="primary"
                  onClick={handleClickOpen}
                  style={styles.chip}
                  clickable
                />
                <Dialog
                  open={openRate}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogContent dividers style={{ minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box style={{marginBottom: '10px'}}>
                    <DialogContentText id="alert-dialog-slide-description" style={{ textAlign: 'center', fontSize: '17px' }}>
                      Please rate this user
                    </DialogContentText>
                    </Box>
                    <Rating
                      name="widget-rating"
                      value={rating}
                      onChange={handleRatingChange}
                      size="large"
                      style={{ fontSize: 40 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Save</Button>
                  </DialogActions>
                </Dialog>
              </Box>
            )}
          </Typography>         
        </Box>
      </Box>
      {/* LinkedIn Icon */}
      <Box display="flex" justifyContent="center" >
        <a
          href={
            userData.websiteLink.startsWith('http')
              ? userData.websiteLink
              : `https://${userData.websiteLink}`
          }
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: palette.primary.main}}
        >
          <LinkedInIcon fontSize="large" color="primary" />
        </a>
      </Box> 
    </WidgetWrapper>
  );
};

export default UserCardWidget;
