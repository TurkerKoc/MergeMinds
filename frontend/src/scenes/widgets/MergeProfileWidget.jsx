import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { Avatar, Typography } from '@mui/material';

const MergeProfileWidget = ({ userId }) => {
	const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    return (
      <WidgetWrapper>
        <Typography>
            {user.name} {user.surname}
        </Typography>
      </WidgetWrapper>
    );
  };
  
  export default MergeProfileWidget;