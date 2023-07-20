import { Box } from "@mui/material";
import { styled } from "@mui/system";

const FlexBetween = styled(Box)({ // we will use styled box too much in this project so we will create a component for it
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
