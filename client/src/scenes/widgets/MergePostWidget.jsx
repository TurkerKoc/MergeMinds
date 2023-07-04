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
  import { useEffect } from "react";
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
    const loggedInUserCoins = useSelector((state) => state.user.mergeCoins);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const DislikesCount = Object.keys(dislikes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const dark = palette.primary.dark;
    const [openPopup, setOpenPopup] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const handleOpenPopup = () => {
      setOpenPopup(true);
    };

    const handleClosePopup = () => {
      setOpenPopup(false);
    };

    const getApplicants = async () => {
      try {
          const res = await fetch(`http://localhost:3001/mergePosts/${postId}/applicants`);
          const data = await res.json();
          //TO DO traverse this data and for each user append it to users array.
          if(data.some(item => item.user._id === loggedInUserId)) {
            setIsApplied(true);
          }
      } catch (error) {
          console.error(error);
      }
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

    useEffect(() => {
      getApplicants(); // Fetch the applicants when the component mounts
    }, []);
  
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
          {!isApplied && (
            <FlexBetween gap="0.25rem" sx={{ marginRight: '0.5rem' }}>
              <Button 
                onClick={handleOpenPopup}// navigate to submission page when user clicks on submit button
                sx={{ fontSize: "15px", display: 'flex', gap: '5px' }}
              >
                <span style={{ textTransform: 'lowercase' }}>
                  <span style={{ textTransform: 'capitalize' }}>a</span>pply
                </span>
                <Badge badgeContent={priceId} color="warning">
                  <Paid sx={{ fontSize:"25px" }}/>
                </Badge>  
              </Button>
              <MergeApplyWidget userMergeCoins={loggedInUserCoins} applicationPrice={priceId} userId={loggedInUserId} ideaPostId={postId} open={openPopup} onClose={handleClosePopup} isApplied={isApplied} setIsApplied={setIsApplied}/>       
            </FlexBetween>
          )}
          {isApplied && (
            <CheckCircleIcon sx={{ fontSize: "30px", color: primary }}/>
          )}

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