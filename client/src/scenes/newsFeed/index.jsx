// difference between js and jsx: jsx contains react components
import { Box, useMediaQuery, Button, useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import MergePostsWidget from "scenes/widgets/MergePostsWidget";
import { setPosts } from "state";

const NewsFeed = () => {
  const { palette } = useTheme();
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const handleTopClick = async () => {
    const response = await fetch(`http://localhost:3001/mergePosts/sortedByLikes`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
  };
  const handleNewClick = async () => {
    const response = await fetch(`http://localhost:3001/mergePosts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
  };

  return (
    <Box>
      <Navbar /> {/* Navbar is a component we created in mern-social-media/client/src/scenes/navbar/index.jsx */}
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"} //block mode: each element in a new line, flex mode: all elements in one line
        gap="0.5rem" // gap between elements
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}> {/* flexBasis is a css property to set width of an element and 26% means 26% of parent element (%26 of page) */}
          <LinksWidget />
        </Box >
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "1rem"}
        >
          <Button
            // disabled={!post}
            onClick={handleNewClick}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              mb: "1rem",
            }}
          >
            New
          </Button>
          <Button
            // disabled={!post}
            onClick={handleTopClick}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              mb: "1rem",
              ml: "1rem",
            }}
          >
            Top
          </Button>
          <MergePostsWidget userId={_id} />
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

export default NewsFeed;
