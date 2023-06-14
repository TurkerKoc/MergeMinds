import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import MergeSubmissionWidget from "scenes/widgets/MergeSubmissionWidget";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
const SubmissionPage = () => {
  // const [user, setUser] = useState(null);
  // const { userId } = useParams();
  // const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  // const getUser = async () => {
  //   const response = await fetch(`http://localhost:3001/mergeUsers/${userId}`, {
  //     method: "GET",
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const data = await response.json();
  //   setUser(data);
  // };

  // useEffect(() => {
  //   getUser();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

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
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          {/* <UserWidget userId={user._id} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={user._id} /> */}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MergeSubmissionWidget picturePath={user.picturePath} />
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
