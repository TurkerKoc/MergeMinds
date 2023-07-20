import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "scenes/navbar";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import MergeWebinarWidget from "scenes/widgets/MergeWebinarWidget";
import MergeMyWebinarWidget from "scenes/widgets/MergeMyWebinarWidget";
import { Merge } from "@mui/icons-material";
import Popup from "scenes/widgets/PaymentPopup";

const MergeWebinarPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const {_id, picturePath} = useSelector((state) => state.user);
    localStorage.setItem("lastVisited", "webinar");

    let location = useLocation();
    let query = new URLSearchParams(location.search);
    const paymentStatus = query.get("payment");

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (paymentStatus === 'success') {
            setShowPopup(true);
        }
    }, [paymentStatus]);

    return (
      <Box>
        <Navbar />
        {/* Conditionally render the popup */}
            <Popup open={showPopup} handleClose={() => setShowPopup(false)} />
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
              <MergeMyWebinarWidget/>
            </Box >
          )}

        {!isNonMobileScreens && (
        <Box flexBasis='100%' ml='2rem' mr="2rem">
            <MergeMyWebinarWidget/>
            <Box m="2rem 0" />
            <MergeWebinarWidget userId={_id} />
        </Box>
        )}

        {isNonMobileScreens && (
          <Box flexBasis={isNonMobileScreens ? "66%" : undefined}
          paddingRight="2rem"
          paddingLeft="2rem"
          >
            <MergeWebinarWidget userId={_id} />
        </Box>
                        )}
          {isNonMobileScreens && (
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
              <MergeBlogWidget />
              {/* <FriendListWidget userId={_id} /> */}
            </Box>
          )}  
        </Box>
      </Box>
    );
  };
  
  export default MergeWebinarPage;