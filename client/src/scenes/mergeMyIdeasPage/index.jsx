import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";
import LinksWidget from "scenes/widgets/LinksWidget";
import PersonalNavigatorWidget from "scenes/widgets/PersonalNavigatorWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import MergeMyIdeasWidget from "scenes/widgets/MergeMyIdeasWidget";
import UserCard from "scenes/widgets/UserCardWidget";

const MergeMyIdeasPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleMyDraftsClick = () => {
        navigate(`/mergeProfilePage/${_id}?showMyDrafts=true`);
    };

    return (
        <Box>
            <Navbar />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop="2rem"
                gap="2rem"
            >
                <Box
                    flexBasis={isNonMobileScreens ? "26%" : undefined}
                    paddingLeft="2rem"
                    paddingRight="2rem"
                >
                    <LinksWidget />
                    <Box m="2rem 0" />
                    <PersonalNavigatorWidget onMyDraftsClick={handleMyDraftsClick} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "66%" : undefined}
                    paddingRight="2rem"
                >
                    <MergeMyIdeasWidget />
                </Box>
                {isNonMobileScreens && (
                    <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
                        <UserCard userId={_id} />
                        <Box m="2rem 0" />
                        <AdvertWidget />
                        <Box m="2rem 0" />
                        {/* <FriendListWidget userId={_id} /> */}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MergeMyIdeasPage;
