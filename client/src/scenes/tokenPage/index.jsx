import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import MergeTokenWidget from "scenes/widgets/MergeTokenWidget";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";

const MergeTokenPage = () => {
  // const [user, setUser] = useState(null);
  // const { userId } = useParams();
  // const token = useSelector((state) => state.token);
  // const isNonMobileScreens = useMediaQuery("(min-width:300px)");

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

  // if (!user) return null;

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
        <Box flexBasis={isNonMobileScreens ? "76%" : undefined}>
          <MergeTokenWidget userId={_id} />
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

export default MergeTokenPage;
