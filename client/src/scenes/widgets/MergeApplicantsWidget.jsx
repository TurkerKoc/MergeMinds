import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import WidgetWrapper from "components/WidgetWrapper";
import { Box, Typography, useTheme, Chip } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import GroupIcon from '@mui/icons-material/Group';
import { useEffect, useState } from "react";

const MergeApplicantsWidget = ({ PostId }) => {
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const primary = palette.primary.main;
    const dark = palette.primary.dark;
    const [users, setUsers] = useState([]);

    const getApplicants = async () => {
        try {
            console.log(PostId);
            const res = await fetch(`http://localhost:3001/mergePosts/${PostId}/applicants`);
            const data = await res.json();
            //TO DO traverse this data and for each user append it to users array.
            const updatedUsers = data.map(applicant => applicant.user);
            setUsers(updatedUsers);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getApplicants(); // Fetch the applicants when the component mounts
    }, []);

    return (
        <FlexBetween gap="1rem" alignItems="flex-start">
            <FlexBetween gap="0.5rem">
                <Chip 
                    icon={<GroupIcon />} 
                    color="primary" 
                    label="Applicants" />
                <AvatarGroup max={3}>
                    {users && (users.map((user) => (
                        <Avatar
                            key={user._id}
                            src={user.picturePath}
                        />
                    )))}
                </AvatarGroup>
            </FlexBetween>
        </FlexBetween>
    );
};

export default MergeApplicantsWidget;