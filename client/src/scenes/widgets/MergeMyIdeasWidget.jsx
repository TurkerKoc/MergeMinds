import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import MergePostWidget from "./MergePostWidget";
import MergeMyIdeaWidget from "./MergeMyIdeaWidget";
import { Merge } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Alert } from "@mui/material";

const MergeMyIdeasWidget = () => {    
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const cur_user = useSelector((state) => state.user);

    const getUserPosts = async () => {
        console.log(cur_user._id);
        const response = await fetch(
        `http://localhost:3001/mergePosts/${cur_user._id}/posts`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    };

    useEffect(() => {        
        getUserPosts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
        {!posts.length && (
            <Alert variant="outlined" severity="info" style={{ marginTop: '5px' }}>
                <Typography variant="h6" style={{ marginBottom: '0.1rem', textAlign: 'center'}}>
                    You have no idea posts
                </Typography>
            </Alert>
        )}
        {posts && (posts.map(
            ({
            _id,
            userId,
            locationId,
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
            picturePath,
            createdAt
            //TODO add everything else
            }) => (
            <MergeMyIdeaWidget
                key={_id}
                postId={_id}
                postUserId={userId._id}            
                name={`${userId.name} ${userId.surname}`}
                userPicturePath={userId.picturePath}
                trustPoints={userId.trustPoints}
                picturePath={picturePath}
                location={locationId.name}
                isDeleted={isDeleted}
                title={title}
                description={description}
                isHidden={isHidden}
                prepaidApplicants={prepaidApplicants}
                categoryId={categoryId.domain}
                priceId={priceId.amount}
                likes={likes}
                dislikes={dislikes}
                Applications={Applications}
                createdAt={createdAt}
            />
            )
        ))}
        </>
    );
};

export default MergeMyIdeasWidget;
