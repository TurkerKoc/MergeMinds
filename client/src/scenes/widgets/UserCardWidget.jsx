import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Divider } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import WidgetWrapper from 'components/WidgetWrapper';

const UserCardWidget = ({userId}) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/mergeUsers/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Error fetching user data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUser();
  }, [userId, token]);

  const userData = {
    name: user ? `${user.name} ${user.surname}` : '',
    profilePicture: user ? `http://localhost:3001/assets/${user.picturePath}` : '',
    trustPoints: user && user.trustPoints ? user.trustPoints : '?',
    websiteLink: user && user.webSiteLink ? user.webSiteLink : '',
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginRight: '0.5rem',
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
              <span>{userData.trustPoints} Points</span>
            </div>
          </Typography>
          {/* LinkedIn Icon */}
          <Box display="flex" justifyContent="center">
            <a
              href={
                userData.websiteLink.startsWith('http')
                  ? userData.websiteLink
                  : `https://${userData.websiteLink}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: palette.primary.main }}
            >
              <LinkedInIcon fontSize="large" color="primary" />
            </a>
          </Box>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserCardWidget;
