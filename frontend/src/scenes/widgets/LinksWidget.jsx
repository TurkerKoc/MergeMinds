import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { Box } from "@mui/material";
import Person2Icon from '@mui/icons-material/Person2';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import { Message, Paid }from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // useNavigate used for navigation between pages
import { useSelector } from "react-redux";

const LinksWidget = () => {
  const { palette } = useTheme();
  const navigate = useNavigate(); 
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const user = useSelector((state) => state.user);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
			>
        MENU
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
					<FlexBetween gap="1rem">
					<Box
						onClick={() => {
							navigate(`/newsFeed`);
							navigate(0);
						}}
						display="flex"  // Added display="flex"
						alignItems="center" // Added alignItems="center"											
					>
						<HomeIcon />
						<Typography
							color={main}
							variant="h5"
							fontWeight="500"
							sx={{
								"&:hover": {
									color: palette.primary.light,
									cursor: "pointer",
								},
								marginLeft: "0.5rem"
							}}
						>
							Explore
						</Typography>
					</Box>				
				</FlexBetween>
				<FlexBetween gap="1rem">				
					<Box
						onClick={() => {
							navigate(`/mergeProfilePage/${user._id}`);
							navigate(0);
						}}
						display="flex"  // Added display="flex"
						alignItems="center" // Added alignItems="center"												
					>
						<Person2Icon />
						<Typography
							color={main}
							variant="h5"
							fontWeight="500"
							sx={{
								"&:hover": {
									color: palette.primary.light,
									cursor: "pointer",
								},
								marginLeft: "0.5rem"
							}}
						>
							Profile
						</Typography>
					</Box>
				</FlexBetween>
				<FlexBetween gap="1rem">
					<Box
						onClick={() => {
							navigate(`/mergeDirectMessages`);
							navigate(0);
						}}
						display="flex"  // Added display="flex"
						alignItems="center" // Added alignItems="center"											
					>
						<Message />
						<Typography
							color={main}
							variant="h5"
							fontWeight="500"
							sx={{
								"&:hover": {
									color: palette.primary.light,
									cursor: "pointer",
								},
								marginLeft: "0.5rem"
							}}
						>
							Direct Messages
						</Typography>
					</Box>				
				</FlexBetween>
				<FlexBetween gap="1rem">
					<Box
						onClick={() => {
							navigate(`/token/${user._id}`)
							navigate(0);
						}}
						display="flex"  // Added display="flex"
						alignItems="center" // Added alignItems="center"											
					>
						<Paid />
						<Typography
							color={main}
							variant="h5"
							fontWeight="500"
							sx={{
								"&:hover": {
									color: palette.primary.light,
									cursor: "pointer",
								},
								marginLeft: "0.5rem"
							}}
						>
							MergeCoins
						</Typography>
					</Box>				
				</FlexBetween>
				<FlexBetween gap="1rem">
					<Box
						onClick={() => navigate(`/webinar/${user._id}`)} 
						display="flex"  // Added display="flex"
						alignItems="center" // Added alignItems="center"					
						sx={{ marginBottom: "1rem" }}						
					>
						<EventIcon />
						<Typography
							color={main}
							variant="h5"
							fontWeight="500"
							sx={{
								"&:hover": {
									color: palette.primary.light,
									cursor: "pointer",
								},
								marginLeft: "0.5rem"
							}}
						>
							Webinars
						</Typography>
					</Box>				
				</FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default LinksWidget;
