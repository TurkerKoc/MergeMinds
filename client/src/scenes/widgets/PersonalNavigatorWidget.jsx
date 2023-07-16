import {Typography, useTheme} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import {Box} from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import HomeIcon from "@mui/icons-material/Home";
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const PersonalNavigatorWidget = ({onMyDraftsClick}) => {
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    return (
        <WidgetWrapper>
            <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{mb: "1.5rem"}}>
                Personal Navigator
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                <FlexBetween gap="1rem" alignItems="flex-start">
                    <Box
                        onClick={() => {
                            navigate(`/mergeMyIdeas`);
                        }}
                        display="flex"
                        alignItems="center"
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
                                marginLeft: "0.5rem",
                            }}
                        >
                            My Ideas
                        </Typography>
                    </Box>
                </FlexBetween>
                <FlexBetween gap="1rem" alignItems="flex-start">
                    <Box
                        onClick={() => {
                            navigate(`/mergeMyApplications`);
                        }}
                        display="flex"
                        alignItems="center"
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
                <FlexBetween gap="1rem" alignItems="flex-start">
                    <Box
                        onClick={() => {
                            onMyDraftsClick();
                        }}
                        display="flex"
                        alignItems="center"
                        sx={{marginBottom: "1rem"}}
                    >
                        <AlignHorizontalCenterIcon/>
                        <Typography
                            color={main}
                            variant="h"
                            fontWeight="500"
                            sx={{
                                "&:hover": {
                                    color: palette.primary.light,
                                    cursor: "pointer",
                                },
                                marginLeft: "0.5rem",
                            }}
                        >
                            My Drafts
                        </Typography>
                    </Box>
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    );
};

export default PersonalNavigatorWidget;
