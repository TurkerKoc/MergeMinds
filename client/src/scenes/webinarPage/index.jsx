import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import MergeWebinarWidget from "scenes/widgets/MergeWebinarWidget";
import { Merge } from "@mui/icons-material";

const MergeWebinarPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:300px)");
    const {_id, picturePath} = useSelector((state) => state.user);
  
    return (
      <Box>
        <Navbar />
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
          <Box flexBasis={isNonMobileScreens ? "76%" : undefined}>
            <MergeWebinarWidget userId={_id} />
        </Box>
          {isNonMobileScreens && (
            <Box flexBasis="26%">
              <MergeBlogWidget />
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
  
  export default MergeWebinarPage;