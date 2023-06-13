import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import MergePostWidget from "./MergePostWidget";
import { Merge } from "@mui/icons-material";

const MergePostsWidget = ({ userId, isProfile = false }) => {
	const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/mergePosts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/mergePosts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          locationId,
          title,
          description,
          isHidden,
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
          <MergePostWidget
            key={_id}
            postId={_id}
            postUserId={userId._id}            
            name={`${userId.name} ${userId.surname}`}
            userPicturePath={userId.picturePath}
            trustPoints={userId.trustPoints}
            picturePath={picturePath}
            location={locationId.name}
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
      )}
    </>
  );
};

export default MergePostsWidget;
