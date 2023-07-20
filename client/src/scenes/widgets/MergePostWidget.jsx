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
import { Paid } from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import emailjs from '@emailjs/browser';

const MergePostWidget = ({
    postId,
    postUserId,
    name,
    email,
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
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const loggedInUserCoins = useSelector((state) => state.user.mergeCoins);
    const loggedInUserName = useSelector((state) => state.user.name + " " + state.user.surname);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const DislikesCount = Object.keys(dislikes).length;
    const bluredDescription = "This is a blured description to show all the time.";

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const dark = palette.primary.dark;
    const [openPopup, setOpenPopup] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [trustPointViewCount, setTrustPointViewCount] = useState(0);

    const sendEmail = () => {
        emailjs.send('service_vaxd84v', 'template_ca3i5qs', {
            to_name: name,
            from_name: loggedInUserName,
            reply_to: email
        }, 'i0ct3E73-yR2Mvgxy')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
    };

    const handleApply = () => {
        sendEmail();
        setIsApplied(true);
    };
    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const handlePictureClick = () => {
        if (name == "admin admin") {
            window.open(`http://localhost:3001/assets/${picturePath}`)
        }
    }

    const handleDM = () => {
        navigate(`/mergeDirectMessages/${postUserId}`);
    };

    const getApplicants = async () => {
        try {
            if (name !== "admin admin") {
                const res = await fetch(`http://localhost:3001/mergePosts/${postId}/applicants`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                if (res.ok) {
                    const data = await res.json();
                    //TO DO traverse this data and for each user append it to users array.
                    if (data && data.length > 0 && data.some(item => item.user._id === loggedInUserId)) {
                        setIsApplied(true);
                    }
                }
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

    const getUser = async () => {
        try {
            const response = await fetch(`http://localhost:3001/mergeUsers/${postUserId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setTrustPointViewCount(data.trustPointViewCount);
            } else {
                console.error('Error fetching user data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        getApplicants(); // Fetch the applicants when the component mounts
        getUser();
    }, []);
    // Check if the logged-in user is the owner of the idea post
    const isOwner = postUserId === loggedInUserId;

    return (
        <WidgetWrapper
            mb="2rem"
            sx={{
                padding: "1.4rem",
                maxWidth: "100%", // Set the maximum width of the widget
                width: "100%", // Ensure the widget takes up the full width of the container
            }}
        >
            {name !== "admin admin" && (
                <FlexBetween gap="1rem" alignItems="flex-start">
                    <MergeUser
                        friendId={postUserId}
                        name={name.split(' ')[0] + ' ' + name.split(' ')[1][0] + '.'}
                        subtitle={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        userPicturePath={userPicturePath}
                        trustPoints={trustPoints}
                        trustPointViewCount={trustPointViewCount}
                        isApplied={isApplied}
                        isOwner={isOwner}
                    />
                    {!isOwner && !isApplied && (
                        <div>
                            <FlexBetween gap="0.25rem" sx={{ marginRight: '0.5rem' }}>
                                <Button
                                    onClick={handleOpenPopup}// navigate to submission page when user clicks on submit button
                                    sx={{ fontSize: "15px", display: 'flex', gap: '5px', marginLeft: '2rem' }}
                                >
                                    <span style={{ textTransform: 'lowercase' }}>
                                        <span style={{ textTransform: 'capitalize' }}>a</span>pply
                                    </span>
                                    {prepaidApplicants == 0 && (
                                        <Badge badgeContent={priceId} color="warning">
                                            <Paid sx={{ fontSize: "25px" }} />
                                        </Badge>
                                    )}
                                </Button>
                            </FlexBetween>
                            <MergeApplyWidget userMergeCoins={loggedInUserCoins} applicationPrice={prepaidApplicants <= 0 ? priceId : 0}
                                userId={loggedInUserId} ideaPostId={postId} ideaPostUserId={postUserId}
                                open={openPopup} onClose={handleClosePopup} onResult={handleApply} />
                            {prepaidApplicants > 0 && (
                                <div style={{ display: 'block', textAlign: '' }}>
                                    <Typography variant="caption" style={{ marginTop: '4px', fontWeight: 'lighter', fontStyle: 'italic', fontSize: '11px' }}>
                                        Only {prepaidApplicants} free apply left!
                                    </Typography>
                                </div>
                            )}
                        </div>
                    )}
                    {isApplied && (
                        <FlexBetween gap="0.25rem" sx={{ marginRight: '0.5rem' }}>
                            <Chip
                                label="DM"
                                onClick={handleDM}
                                icon={<ForumRoundedIcon />}
                                color="primary"
                                sx={{
                                    fontSize: '13px',
                                    height: '27px',
                                    padding: '2.5px',
                                    borderRadius: '20px',
                                }}
                            />
                            <CheckCircleIcon sx={{ fontSize: "30px", color: primary }} />
                        </FlexBetween>
                    )}
                </FlexBetween>
            )}
            {name == "admin admin" && (
                <Chip icon={<HandshakeOutlinedIcon />} label="SPONSORED CONTENT" />)
            }
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
                {isHidden && !isOwner && !isApplied ? <span style={{
                    filter: "blur(5px)",
                    pointerEvents: "none",
                    userSelect: "none"
                }}>{bluredDescription}</span> : description}
            </Typography>
            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{
                        borderRadius: "0.75rem",
                        marginTop: "0.75rem",
                        filter: isHidden && !isOwner && !isApplied ? "blur(30px)" : "none",
                        pointerEvents: isHidden && !isOwner && !isApplied ? "none" : "auto",
                    }} onClick={() => handlePictureClick()}
                    src={`http://localhost:3001/assets/${picturePath}`}
                />
            )}
            {name !== "admin admin" && (
                <FlexBetween gap="1rem" alignItems="flex-start" sx={{ mt: "1rem", mb: "0.5rem" }}>
                    <FlexBetween gap="0.5rem">
                        <Chip label={location} />
                        <Chip label={categoryId} />
                    </FlexBetween>
                    <FlexBetween mt="0.50rem" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            )}

        </WidgetWrapper>
    );
};

export default MergePostWidget;
