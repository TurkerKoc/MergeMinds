import {Box} from "@mui/material";
import {useSelector} from "react-redux";
import {useParams, useNavigate, Link} from "react-router-dom";
import Navbar from "scenes/navbar";
import PersonalNavigator from "scenes/widgets/PersonalNavigatorWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import UserCard from "scenes/widgets/UserCardWidget";
import SummaryWidget from "scenes/widgets/SummaryWidget";
import MyDraftsWidget from "scenes/widgets/MyDraftsWidget";
import {useState, useEffect} from "react";

const MergeProfilePage = () => {
    const {userId} = useParams();
    const loggedInUser = useSelector((state) => state.user);
    const [showMyDrafts, setShowMyDrafts] = useState(false);
    const navigate = useNavigate();

    const isNonMobileScreens = true;
    let myProfile = false;
    if (loggedInUser._id === userId) {
        myProfile = true;
    }

    const handleMyDraftsClick = () => {
        navigate(`/mergeProfilePage/${userId}?showMyDrafts=true`);
        setShowMyDrafts(true);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setShowMyDrafts(urlParams.get("showMyDrafts") === "true");
    }, []);

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
                <Box
                    flexBasis={isNonMobileScreens ? "26%" : undefined}
                    paddingLeft="2rem"
                    paddingRight="2rem"
                >
                    <LinksWidget/>
                    <Box m="2rem 0"/>
                    {myProfile && (
                        <PersonalNavigator onMyDraftsClick={handleMyDraftsClick}/>
                    )}{" "}
                    {/* Conditionally render PersonalNavigator */}
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "66%" : undefined}
                    paddingRight="2rem"
                >
                    {showMyDrafts ? <MyDraftsWidget/> : <SummaryWidget/>}
                </Box>
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
                    <UserCard userId={userId}/>
                </Box>
            </Box>
        </Box>
    );
};

export default MergeProfilePage;
