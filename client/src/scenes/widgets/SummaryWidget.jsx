import {Box, Typography, Avatar, useTheme} from "@mui/material";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import WidgetWrapper from "components/WidgetWrapper";

const SummaryWidget = () => {
    const {palette} = useTheme();
    const {userId} = useParams();
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`http://localhost:3001/mergeUsers/${userId}`, {
                    method: 'GET',
                    headers: {Authorization: `Bearer ${token}`},
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
        description: user && user.profileSummary ? user.profileSummary : 'Not available',
        summary: "Summary",
    };

    return (
        <WidgetWrapper>
        <Box
            p={2}
            color={palette.text.primary}
        >
            <Box display="flex" alignItems="center" gap="1rem">
                <Avatar src={userData.profilePicture} alt={userData.name}/>
                <Typography style={{ fontSize: '24px' }} variant="h6">{userData.name}</Typography>
            </Box>
            <Box mt={3}>
                <Typography variant="h6" style={{ fontSize: '24px' }}>{userData.summary}</Typography>
                <Typography mt={2} variant="body1" style={{ fontSize: '16px' }}>{userData.description}</Typography>
            </Box>
        </Box>
        </WidgetWrapper>
    );
};

export default SummaryWidget;
