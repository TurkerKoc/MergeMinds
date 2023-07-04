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
  import MergeApplyWidget from "scenes/widgets/MergeApplyWidget";
  import Badge from '@mui/material/Badge';
  import {
    Button, // Button is a component from material ui library
  } from "@mui/material";
  import { Tooltip } from '@mui/material';
  import CoinIcon from '@mui/icons-material/LocalAtm';
  import{ Paid } from "@mui/icons-material"; 
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
    const [openPopup, setOpenPopup] = useState(false);

    const handleOpenPopup = () => {
      setOpenPopup(true);
    };

    const handleClosePopup = () => {
      setOpenPopup(false);
    };

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
              <Button 
                variant="contained"                 
                onClick={handleOpenPopup}// navigate to submission page when user clicks on submit button
                sx={{ fontSize: "11px" }}
              >
                Apply
              </Button>
              <MergeApplyWidget userId={loggedInUserId} ideaPostId={postId} open={openPopup} onClose={handleClosePopup} />       
              <Badge badgeContent={priceId + 1} color="warning">
                <Paid sx={{ fontSize: "25px" }}/>
              </Badge>  
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