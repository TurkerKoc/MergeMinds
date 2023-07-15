import {Box} from "@mui/material";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import Navbar from "scenes/navbar";
import PersonalNavigator from "scenes/widgets/PersonalNavigatorWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import UserCard from "scenes/widgets/UserCardWidget";
import SummaryWidget from "scenes/widgets/SummaryWidget";
import ChatWidget from "../widgets/ChatWidget";
import {useContext} from "react";
// import {ChatContext} from "../../components/ChatContext";

const MergeDirectMessages = () => {
    console.log("MergeDirectMessages")
    const userId = useSelector((state) => state.user._id);
    const {postUserId} = useParams();
    const loggedInUser = useSelector((state) => state.user);
    const isNonMobileScreens = true;
    let myProfile = false;
    if (loggedInUser._id === userId) {
        myProfile = true;
    }
    console.log("loggedInUser:", loggedInUser._id);
    console.log("userId:", userId);

    if (!userId) return null;

    return (
        <Box>
            <Navbar/>
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop="2rem"
                gap="2rem"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}
                    paddingLeft="2rem" paddingRight="2rem">
                    <LinksWidget/>
                    <Box m="2rem 0" />
                    {myProfile && <PersonalNavigator/>} {/* Conditionally render PersonalNavigator */}
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                >
                    <ChatWidget postUserId={postUserId}/>
                </Box>
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}
                    paddingRight="2rem" mb={5}
                >
                    <UserCard userId={userId}/>
                </Box>
            </Box>
        </Box>
    );


};

export default MergeDirectMessages;
