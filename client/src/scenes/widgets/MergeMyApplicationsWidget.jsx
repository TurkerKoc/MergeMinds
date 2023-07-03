import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import MergePostWidget from "./MergePostWidget";
import { Merge } from "@mui/icons-material";

const MergeMyApplicationsWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getUserApplications = async () => {
    const response = await fetch(
      `http://localhost:3001/mergePosts/${userId}/applications`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    getUserApplications();
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

export default MergeMyApplicationsWidget;
