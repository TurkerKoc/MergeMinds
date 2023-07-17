import {
    FavoriteBorderOutlined,
    FavoriteOutlined,
  } from "@mui/icons-material";
  import { Box, Typography, useTheme, Chip } from "@mui/material";
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
  import MergeApplicantsWidget from "./MergeApplicantsWidget";
  
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