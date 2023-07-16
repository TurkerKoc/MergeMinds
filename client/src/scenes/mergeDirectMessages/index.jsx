import {Box, useMediaQuery, Button, useTheme, Select, MenuItem} from "@mui/material";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import Navbar from "scenes/navbar";
import PersonalNavigator from "scenes/widgets/PersonalNavigatorWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import UserCard from "scenes/widgets/UserCardWidget";
import ChatWidget from "../widgets/ChatWidget";
import {useNavigate} from "react-router-dom";

const MergeDirectMessages = () => {
    console.log("MergeDirectMessages")
    const userId = useSelector((state) => state.user._id);
    const {postUserId} = useParams();
    const loggedInUser = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    let myProfile = false;
    const navigate = useNavigate();
    if (loggedInUser._id === userId) {
        myProfile = true;
    }
    console.log("loggedInUser:", loggedInUser._id);
    console.log("userId:", userId);

    if (!userId) return null;

    const handleMyDraftsClick = () => {
        navigate(`/mergeProfilePage/${userId}?showMyDrafts=true`);
    };


    return (
        <Box>
            <Navbar/>
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
                        <LinksWidget/>
                        <Box m="2rem 0"/>
                        {myProfile && (
                            <PersonalNavigator
                                onMyDraftsClick={handleMyDraftsClick} // Pass the click handler function
                            />
                        )}
                        {/* Conditionally render PersonalNavigator */}
                    </Box>
                )}

                {!isNonMobileScreens && (
                    <Box flexBasis="100%" ml='2rem' mr="2rem">
                        <ChatWidget postUserId={postUserId}/>
                        <Box m="2rem 0"/>
                        {myProfile && <PersonalNavigator/>} {/* Conditionally render PersonalNavigator */}
                        <Box m="2rem 0"/>
                    </Box>
                )}


                {isNonMobileScreens && (
                    <Box flexBasis={isNonMobileScreens ? "66%" : undefined}
                         paddingRight="2rem"
                         paddingLeft="2rem"
                    >
                        <ChatWidget postUserId={postUserId}/>
                    </Box>
                )}
                {isNonMobileScreens && (
                    <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
                        <UserCard userId={userId}/>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MergeDirectMessages;
