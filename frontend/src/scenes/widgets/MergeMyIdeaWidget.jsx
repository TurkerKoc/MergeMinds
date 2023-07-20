import {
    FavoriteBorderOutlined,
    FavoriteOutlined,
  } from "@mui/icons-material";
  import { Box, Typography, useTheme, Chip, Tooltip } from "@mui/material";
  import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
  import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
  import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
  import FlexBetween from "components/FlexBetween";
  import MergeUser from "components/MergeUser";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "state";
  import formatDistanceToNow from 'date-fns/formatDistanceToNow';
  import Rating from '@mui/material/Rating';
  import {setPosts} from "state";
  import MergeApplicantsWidget from "./MergeApplicantsWidget";
  import DeleteIcon from '@mui/icons-material/Delete';
  import {useEffect} from "react";
  import IconButton from '@mui/material/IconButton';
  import Switch from '@mui/material/Switch';
  import HelpIcon from '@mui/icons-material/Help';
import { set } from "date-fns";

  const MergeMyIdeaWidget = ({
    postId,
    postUserId,
    name,
    subtitle,
    userPicturePath,
    trustPoints,
    picturePath,
    location,
    title,
    description,
    isHidden,
    isDeleted,
    prepaidApplicants,
    categoryId,
    priceId,
    likes,
    dislikes,
    Applications,
    createdAt,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const loggedInUser = useSelector((state) => state.user);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const DislikesCount = Object.keys(dislikes).length;
    let [selectedIsRemoved, setSelectIsRemoved] = useState(isDeleted);
    

    const patchHide = async () => {
      const response = await fetch(`http://localhost:3001/mergePosts/${postId}/hide`, {
          method: "PATCH",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({userId: loggedInUserId}),
      });
      const updatedPost = await response.json();
      dispatch(setPost({post: updatedPost}));
      setSelectIsRemoved(updatedPost.isDeleted)
  };


  const patchVisible = async () => {
    const response = await fetch(`http://localhost:3001/mergePosts/${postId}/visible`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId: loggedInUserId}),
    });
    const updatedPost = await response.json();
    dispatch(setPost({post: updatedPost}));
    setSelectIsRemoved(updatedPost.isDeleted)
};

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const primary = palette.primary.main;
    const dark = palette.primary.dark;
  

    return (
      <WidgetWrapper
            mb="2rem"
            sx={{
                padding: "1.4rem",
                maxWidth: "100%", // Set the maximum width of the widget
                width: "100%", // Ensure the widget takes up the full width of the container
            }}
        >
        <FlexBetween gap="1rem" alignItems="flex-start">
          <MergeUser
            friendId={postUserId}
            name={name}
            subtitle={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            userPicturePath={userPicturePath}
            trustPoints={trustPoints}
            trustPointViewCount={loggedInUser.trustPointViewCount}
          />
          <Tooltip title={<Typography>
            Turning off this option will hide your idea from other users, making it invisible to them. 
            Please note that your idea will not appear or be visible in any public areas or newsfeeds.
          </Typography>}>
          

          <Switch
            checked={!selectedIsRemoved ? true : false}
            onChange={(event) => {
              if (event.target.checked) {
                patchVisible()
              } else {
                patchHide()
                
              }
            }}
            color="primary"

          />
          <HelpIcon/>
                              </Tooltip>
          
        </FlexBetween>

        <Typography color={main} sx={{ mt: "1rem" }}>
          <strong>{title}</strong>
        </Typography>
        <Typography
                color={main}
                sx={{
                mt: "1rem",
                mb: "1rem",
                maxWidth: "100%",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                }}
            >
            {description}
        </Typography>
        <MergeApplicantsWidget PostId={postId} />
        <FlexBetween gap="1rem" alignItems="flex-start" sx={{ mt: "1rem", mb: "0.5rem"}}>
          <FlexBetween gap="0.5rem">
            <Chip label = {location}/>
            <Chip label = {categoryId}/>
          </FlexBetween>
          <FlexBetween mt="0.50rem" sx={{ display: 'flex', justifyContent: 'flex-end'}}>
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <ArrowUpwardIcon>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: primary }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </ArrowUpwardIcon>
                <Typography>{likeCount}</Typography>
              </FlexBetween>              
              <FlexBetween gap="0.3rem">
                <ArrowDownwardIcon>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: primary }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </ArrowDownwardIcon>
                <Typography>{DislikesCount}</Typography>
              </FlexBetween>         
            </FlexBetween>          
          </FlexBetween>
        </FlexBetween>
        
      </WidgetWrapper>
    );
  };
  
  export default MergeMyIdeaWidget;