import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import MergeSubmissionWidget from "scenes/widgets/MergeSubmissionWidget";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import Popup from "scenes/widgets/PaymentPopup";

const SubmissionPage = () => {
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [savedDraftData, setSavedDraftData] = useState(() => {
    const savedFormData = localStorage.getItem('submissionFormData');
    if (savedFormData) {
      return JSON.parse(savedFormData);
    }
    return null;
  });
  localStorage.setItem("lastVisited", "submission");

  let location = useLocation();
  let query = new URLSearchParams(location.search);
  const paymentStatus = query.get("payment");

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (paymentStatus === 'success') {
        setShowPopup(true);
    }
}, [paymentStatus]);

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Popup open={showPopup} handleClose={() => setShowPopup(false)} />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}> {/* flexBasis is a css property to set width of an element and 26% means 26% of parent element (%26 of page) */}
          <LinksWidget />
        </Box >
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MergeSubmissionWidget id={user._id} savedDraftData={savedDraftData || {}} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <MergeBlogWidget />
            <Box m="2rem 0" />
            <AdvertWidget />
            <Box m="2rem 0" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SubmissionPage;
