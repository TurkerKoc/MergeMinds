import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "scenes/navbar";
import PersonalNavigator from "scenes/widgets/PersonalNavigatorWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import UserCard from "scenes/widgets/UserCardWidget";
import ChatWidget from "../widgets/ChatWidget";
import { useNavigate } from "react-router-dom";

const MergeDirectMessages = () => {
    // console.log("MergeDirectMessages");
    const userId = useSelector((state) => state.user._id);
    const { postUserId, showMyDrafts } = useParams();
    const loggedInUser = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    let myProfile = false;
    const navigate = useNavigate();
    const location = useLocation();

    if (loggedInUser._id === userId) {
        myProfile = true;
    }
    // console.log("loggedInUser:", loggedInUser._id);
    // console.log("userId:", userId);

    useEffect(() => {
        if (!userId) return; // Skip the effect if userId is not available yet

        const handlePageLeave = () => {
            const timestamp = new Date().toISOString();
            const localTimestamp = new Date(timestamp).toLocaleString(); // Convert to local time
            console.log("User left MergeDirectMessages at:", localTimestamp);
            localStorage.setItem("userLeftDirectMessagesPage", localTimestamp);
        };

        const unlisten = () => {
            handlePageLeave();
            window.removeEventListener("beforeunload", handlePageLeave);
        };

        window.addEventListener("beforeunload", handlePageLeave);

        return () => {
            unlisten();
        };
    }, [userId]); // Add userId as a dependency for the effect

    const handleMyDraftsClick = () => {
        navigate(`/mergeProfilePage/${userId}?showMyDrafts=true`);
    };

    if (!userId) return null;

    return (
        <Box>
            <Navbar />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop="2rem"
                gap="2rem"
            >
                {isNonMobileScreens && (
                    <Box
                        flexBasis={isNonMobileScreens ? "26%" : undefined}
                        paddingLeft="2rem"
                    >
                        <LinksWidget />
                        <Box m="2rem 0" />
                        {myProfile && (
                            <PersonalNavigator
                                onMyDraftsClick={handleMyDraftsClick}
                            />
                        )}
                        {/* Conditionally render PersonalNavigator */}
                    </Box>
                )}

                {!isNonMobileScreens && (
                    <Box flexBasis="100%" ml="2rem" mr="2rem">
                        <ChatWidget postUserId={postUserId} />
                        <Box m="2rem 0" />
                        {myProfile && <PersonalNavigator />}
                        {/* Conditionally render PersonalNavigator */}
                        <Box m="2rem 0" />
                    </Box>
                )}

                {isNonMobileScreens && (
                    <Box
                        flexBasis={isNonMobileScreens ? "66%" : undefined}
                        paddingRight="2rem"
                        paddingLeft="2rem"
                    >
                        <ChatWidget postUserId={postUserId} />
                    </Box>
                )}
                {isNonMobileScreens && (
                    <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
                        <UserCard userId={userId} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MergeDirectMessages;
