import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import Rating from '@mui/material/Rating';

const MergeUser = ({ friendId, name, subtitle, userPicturePath, trustPoints }) => {
  const navigate = useNavigate();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/mergeProfilePage/${friendId}`);
            navigate(0);
          }}
        >
					<FlexBetween gap="0.75rem" mt="0.50rem" sx={{ display: 'flex', justifyContent: 'flex-end'}}>
						<Typography
							color={main}
							variant="h5"
							fontWeight="500"
							sx={{
								"&:hover": {
									color: palette.primary.light,
									cursor: "pointer",
								},
							}}
						>
							{name}
						</Typography>
						<Rating name="read-only" value={trustPoints} readOnly />
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
