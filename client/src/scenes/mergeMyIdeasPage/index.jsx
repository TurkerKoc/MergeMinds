import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MergeProfileWidget from "scenes/widgets/MergeProfileWidget";
import UserWidget from "scenes/widgets/UserWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import PersonalNavigatorWidget from "scenes/widgets/PersonalNavigatorWidget";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import MergeMyIdeasWidget from "scenes/widgets/MergeMyIdeasWidget";
import { Flex } from "@chakra-ui/react";
import FlexBetween from "components/FlexBetween";
import UserCard from "scenes/widgets/UserCardWidget";

const MergeMyIdeasPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.user);  

  return (
    <Box>
      <Navbar />
      <Box
        display="flex"
        justifyContent="space-between"
        marginTop="2rem"
        gap="2rem"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} paddingLeft="2rem" paddingRight="2rem"> {/* flexBasis is a css property to set width of an element and 26% means 26% of parent element (%26 of page) */}
          <LinksWidget />
          <Box m="2rem 0" />
          <PersonalNavigatorWidget />
        </Box >
        <Box
          flexBasis={isNonMobileScreens ? "66%" : undefined}
          paddingRight="2rem"
        >
          <MergeMyIdeasWidget />
        </Box>
        {isNonMobileScreens && (
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem" >
                <UserCard userId={_id}/>
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