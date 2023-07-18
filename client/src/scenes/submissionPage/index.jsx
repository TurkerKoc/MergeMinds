import {Box, useMediaQuery} from "@mui/material";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import Navbar from "scenes/navbar";
import LinksWidget from "scenes/widgets/LinksWidget";
import MergeSubmissionWidget from "scenes/widgets/MergeSubmissionWidget";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import Popup from "scenes/widgets/PaymentPopup";
import PersonalNavigator from "scenes/widgets/PersonalNavigatorWidget";

const SubmissionPage = () => {
    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const navigate = useNavigate();
    const [showMyDrafts, setShowMyDrafts] = useState(false);

    const [savedDraftData, setSavedDraftData] = useState(() => {
        console.log("getting saved data");
        const savedFormData = localStorage.getItem('submissionFormData');
        console.log(savedFormData)
        if (savedFormData) {
            console.log("parsing saved data");
            console.log(JSON.parse(savedFormData));
            return JSON.parse(savedFormData);
        }
        console.log("no saved data")
        return null;
    });

    localStorage.setItem("lastVisited", "submission");

    let location = useLocation();
    let query = new URLSearchParams(location.search);
    const paymentStatus = query.get("payment");

    const [showPopup, setShowPopup] = useState(false);

    const handleMyDraftsClick = () => {
        navigate(`/mergeProfilePage/${user._id}?showMyDrafts=true`);
        setShowMyDrafts(true);
    };

    useEffect(() => {
        if (paymentStatus === 'success') {
            setShowPopup(true);
        }
    }, [paymentStatus]);

    if (!user) return null;

    return (
        <Box>
            <Navbar/>
            <Popup open={showPopup} handleClose={() => setShowPopup(false)}/>
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop="2rem"
                gap="2rem"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}
                     paddingLeft="2rem"
                     paddingRight="2rem">
                    <LinksWidget/>
                    <Box m="2rem 0"/>

                    <PersonalNavigator onMyDraftsClick={handleMyDraftsClick}/>

                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "66%" : undefined}
                    paddingRight="2rem"
                >
                    <MergeSubmissionWidget id={user._id} savedDraftData={savedDraftData || {}}/>
                </Box>
                {isNonMobileScreens && (
                    <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
                        <MergeBlogWidget/>
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

export default SubmissionPage;
