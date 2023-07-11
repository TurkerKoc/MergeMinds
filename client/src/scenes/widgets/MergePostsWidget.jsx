import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import MergePostWidget from "./MergePostWidget";
import { Merge } from "@mui/icons-material";

const MergePostsWidget = ({ userId, isProfile = false }) => {
	const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  function randomizeSponsoredContent(sorted) {
    // console.log("sorted");
    // console.log(sorted);
    const nonAdminPosts = sorted.filter(post => post.userId.username !== 'admin');
    const adminPosts = sorted.filter(post => post.userId.username === 'admin');
    const nonAdminCount = nonAdminPosts.length;
    const adminCount = adminPosts.length;

    let result = [];
    let adminIndex = 0;
    let mod = nonAdminCount > 10 ? 10 : nonAdminCount -1;
    for (let i = 0; i < nonAdminCount; i++) {
      if (i % mod === 0 && adminIndex < adminCount && i !== 0) {
        const randomIndex = getRandomIndex(i - mod, i, result);
        // console.log(randomIndex);
        // console.log(result);
        result.splice(randomIndex, 0, adminPosts[adminIndex]);
        adminIndex++;
      }
      else if(i === nonAdminCount - 1 && adminIndex < adminCount) {
        const randomIndex = getRandomIndex(i - (i%mod), i, result);
        // console.log(randomIndex);
        // console.log(result);
        result.splice(randomIndex, 0, adminPosts[adminIndex]);
        adminIndex++;
      }
      result.push(nonAdminPosts[i]);
    }
    // console.log(result);
    return result;
  }
  const getRandomIndex = (min, max, result) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * (max - min) + min);
    } while (result.includes(randomIndex));

    return randomIndex;
  };
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/mergePosts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const result = randomizeSponsoredContent(data);
    dispatch(setPosts({ posts: result }));
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
