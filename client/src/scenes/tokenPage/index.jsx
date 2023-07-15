import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import MergeTokenWidget from "scenes/widgets/MergeTokenWidget";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
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
          display="flex"
          justifyContent="space-between"
          marginTop="2rem"
          gap="2rem"
        >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} 
          paddingLeft="2rem"
          paddingRight="2rem"> 
          <LinksWidget />
        </Box >

        <Box flexBasis={isNonMobileScreens ? "66%" : undefined} 
          paddingRight="2rem" >
            <MergeTokenWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
         <Box flexBasis={isNonMobileScreens ? "26%" : undefined} mr="2rem">
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
