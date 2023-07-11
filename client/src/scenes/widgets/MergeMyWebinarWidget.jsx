// MyWebinars.jsx
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, useTheme, Typography, List, ListItem, Link } from "@mui/material";
import { setUserWebinars } from "state";


const MergeMyWebinarWidget = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    // const [userWebinars, setUserWebinars] = useState([]);
    const userWebinars = useSelector((state) => state.userWebinars);


    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);

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
                sx={{ mb: "1.5rem" }}
            >
                My Webinars
            </Typography>
            <Box>
                <List>
                    {userWebinars.map((webinar) => (
                        <ListItem key={webinar._id}>
                            <Link href={webinar.zoomLink} target="_blank" rel="noopener noreferrer">
                                {webinar.title}
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </WidgetWrapper>
    );
};

export default MergeMyWebinarWidget;
