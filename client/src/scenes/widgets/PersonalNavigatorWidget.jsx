import {Typography, useTheme} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import {Box} from "@mui/material";
import Person2Icon from '@mui/icons-material/Person2';
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const PersonalNavigatorWidget = () => {
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{mb: "1.5rem"}}
            >
                Personal Navigator
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                <FlexBetween gap="1rem">
                    <Box
                        onClick={() => {
                            navigate(`/mergeMyIdeas`);
                        }}
                        display="flex"  // Added display="flex"
                        alignItems="center" // Added alignItems="center"
                    >
                        <Person2Icon/>
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
                            My Ideas
                        </Typography>
                    </Box>
                </FlexBetween>
                <FlexBetween gap="1rem">
                    <Box
                        // onClick={() => {
                        // 	navigate(`/profile/${friendId}`);
                        // 	TODO: navigate to My Applications
                        // }}
                        display="flex"  // Added display="flex"
                        alignItems="center" // Added alignItems="center"
                        sx={{ marginBottom: "1rem" }}						
                    >
                        <HomeIcon/>
                        <Typography
                            color={main}
                            variant="h5"
                            fontWeight="500"
                            sx={{
                                "&:hover": {
                                    color: palette.primary.light,
                                    cursor: "pointer",
                                },
                                marginLeft: "0.5rem",
                            }}
                        >
                            My Applications
                        </Typography>
                    </Box>
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    );
};

export default PersonalNavigatorWidget;
