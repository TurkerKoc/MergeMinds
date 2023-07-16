import {Box, useMediaQuery} from "@mui/material";
import {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Navbar from "scenes/navbar";
import LinksWidget from "scenes/widgets/LinksWidget";
import PersonalNavigatorWidget from "scenes/widgets/PersonalNavigatorWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import UserCard from "scenes/widgets/UserCardWidget";
import MergeMyApplicationsWidget from "scenes/widgets/MergeMyApplicationsWidget";
import MyDraftsWidget from "../widgets/MyDraftsWidget";

const MergeMyApplicationsPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const {_id} = useSelector((state) => state.user);
    const [showMyDrafts, setShowMyDrafts] = useState(false);
    const navigate = useNavigate();

    const handleMyDraftsClick = () => {
        navigate(`/mergeProfilePage/${_id}?showMyDrafts=true`);
        setShowMyDrafts(true);
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
                    <Box m="2rem 0" />
                    <PersonalNavigatorWidget onMyDraftsClick={handleMyDraftsClick} />
                </Box>
                )}
                
                {!isNonMobileScreens && (
                <Box
                    flexBasis={isNonMobileScreens ? "66%" : '100%'}
                    paddingRight="2rem"
                    paddingLeft="2rem"
                >
                    {showMyDrafts ? (
                        <MyDraftsWidget userId={_id}/>
                    ) : (
                        <MergeMyApplicationsWidget userId={_id}/>
                    )}
                    <Box m="2rem 0" />
                    <PersonalNavigatorWidget onMyDraftsClick={handleMyDraftsClick} />
                    <Box m="2rem 0" />
                </Box>
                )}
                
                {isNonMobileScreens && (
                <Box
                    flexBasis={isNonMobileScreens ? "66%" : undefined}
                    paddingRight="2rem"
                    paddingLeft="2rem"
                >
                    {showMyDrafts ? (
                        <MyDraftsWidget userId={_id}/>
                    ) : (
                        <MergeMyApplicationsWidget userId={_id}/>
                    )}
                </Box>
                )}


                {isNonMobileScreens && (
                    <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
                        <UserCard userId={_id}/>
                        <Box m="2rem 0"/>
                        <AdvertWidget/>
                        <Box m="2rem 0"/>
                        {/* <FriendListWidget userId={_id} /> */}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MergeMyApplicationsPage;