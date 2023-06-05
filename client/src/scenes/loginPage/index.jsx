import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"; // components from material ui library
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme(); // we will use theme from theme.js file
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // useMediaQuery is a hook to check if the screen is mobile or not
  return (
    <Box>
      <Box // this box is for showing logo on navbar -> only logo is visible
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="test">
          MergeMinds
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem" //rem is used for consistent spacing in different screen sizes
        m="2rem auto"
        borderRadius="1.5rem" 
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to MergeMinds, Platform for Game Changers!
        </Typography>
        <Form /> {/* Form is a component we created in mern-social-media/client/src/scenes/loginPage/Form.jsx */}
      </Box>
    </Box>
  );
};

export default LoginPage;
