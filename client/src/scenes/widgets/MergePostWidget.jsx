import {
    FavoriteBorderOutlined,
    FavoriteOutlined,
  } from "@mui/icons-material";
	import { Typography, useTheme, Chip } from "@mui/material";
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
  
  const MergePostWidget = ({
    postId,
    postUserId,
    name,
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
    // return (
    //   <WidgetWrapper mb="2rem">
    //     <Typography sx={{ mb: "1rem" }}>
    //       {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Title: {title}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Location: {location}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Price: {priceId}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Category: {categoryId}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Shared Image: {picturePath}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Description: {description}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       PreapaidApplicants: {prepaidApplicants}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       TrustPoints: {trustPoints}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Name: {name}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       User Picture Path: {userPicturePath}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       LikeCount: {Object.keys(likes).length}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       DislikesCount: {Object.keys(dislikes).length}
    //     </Typography>
    //     <Typography sx={{ mb: "1rem" }}>
    //       Number of Applications: {Object.keys(Applications).length}
    //     </Typography>
    //   </WidgetWrapper>
    // );
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const DislikesCount = Object.keys(dislikes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const dark = palette.primary.dark;
  
    const patchLike = async () => {
      const response = await fetch(`http://localhost:3001/mergePosts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };
    const patchDislike = async () => {
      const response = await fetch(`http://localhost:3001/mergePosts/${postId}/dislike`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };
  
    return (
      <WidgetWrapper mb="2rem">
        <FlexBetween gap="1rem" alignItems="flex-start">
          <MergeUser
            friendId={postUserId}
            name={name}
            subtitle={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            userPicturePath={userPicturePath}
            trustPoints={trustPoints}
          />
          <FlexBetween gap="0.25rem" sx={{ marginRight: '0.5rem' }}>
            <Typography color={palette.primary.dark} sx={{ ml: "1rem"}}>
              {priceId}
            </Typography>
            <MonetizationOnIcon />
          </FlexBetween>
        </FlexBetween>
        <Typography color={main} sx={{ mt: "1rem" }}>
          <strong>{title}</strong>
        </Typography>
        <Typography color={main} sx={{ mt: "1rem", mb: "1rem"}}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )}
        <FlexBetween gap="1rem" alignItems="flex-start" sx={{ mt: "1rem", mb: "0.5rem"}}>
          <FlexBetween gap="0.5rem">
            <Chip label = {location}/>
            <Chip label = {categoryId}/>
          </FlexBetween>
          <FlexBetween mt="0.50rem" sx={{ display: 'flex', justifyContent: 'flex-end'}}>
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <ArrowUpwardIcon onClick={patchLike}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: primary }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </ArrowUpwardIcon>
                <Typography>{likeCount}</Typography>
              </FlexBetween>              
              <FlexBetween gap="0.3rem">
                <ArrowDownwardIcon onClick={patchDislike}>
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
  
  export default MergePostWidget;