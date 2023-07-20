import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import Rating from '@mui/material/Rating';

const MergeUser = ({ friendId, name, subtitle, userPicturePath, trustPoints, trustPointViewCount, isApplied, isOwner }) => {
  const navigate = useNavigate();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const handleClick = () => {
    if (isApplied || isOwner) {
      navigate(`/mergeProfilePage/${friendId}`);
      navigate(0);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
    
  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {handleClick()}}
        >
					<FlexBetween gap="0.75rem" mt="0.50rem" sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: (theme) => (isApplied || isOwner ? theme.palette.primary.light : main),
                cursor: (isApplied || isOwner) ? "pointer" : "default",
              },
            }}
          >
            {name}
          </Typography>
          <div style={styles.container}>
						<Rating name="read-only" value={trustPoints} readOnly />
            <span style={{marginLeft: "0.2rem", fontSize: "13px", fontFamily: "Roboto, sans-serif", color: "#AAAAAA"}}>({trustPointViewCount})</span> 
          </div>
					</FlexBetween>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
};

export default MergeUser;
