import { useState } from "react"; // useState is a react hook
import {
  Box,
  Button, // Button is a component from material ui library
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material"; // components from material ui library
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Paid
} from "@mui/icons-material"; // you can find icons in https://mui.com/material-ui/material-icons
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from "react-redux"; // useDispatch used for dispatching actions to redux store and useSelector used for selecting data from redux store
import { setMode, setLogout } from "state"; // setMode and setLogout are actions from state.js
import { useNavigate } from "react-router-dom"; // useNavigate used for navigation between pages
import FlexBetween from "components/FlexBetween"; // FlexBetween is a component we created in mern-social-media/client/src/components/FlexBetween.jsx 
import Badge from '@mui/material/Badge';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false); // isMobileMenuToggled is a state and setIsMobileMenuToggled is a function to change the state
  const dispatch = useDispatch(); // dispatch is a function to dispatch actions to redux store
  const navigate = useNavigate(); 
  const user = useSelector((state) => state.user); // grabbing user data from redux store
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // useMediaQuery is a hook to check if the screen is mobile or not

  const theme = useTheme(); // grabbing theme from material ui -> we defined theme in mern-social-media/client/src/theme.js
  const neutralLight = theme.palette.neutral.light; // grabbing neutral light color from theme
  const dark = theme.palette.neutral.dark; // grabbing neutral dark color from theme
  const background = theme.palette.background.default; // grabbing background color from theme
  const primaryLight = theme.palette.primary.light; // grabbing primary light color from theme
  const alt = theme.palette.background.alt; // grabbing alt color from theme

  const fullName = `${user.name} ${user.surname}`; // grabbing user's full name to show it in navbar
  return (
    <FlexBetween padding="1rem 2.5%" backgroundColor={alt}> {/* for box component you can pass additional css properties like padding, backgroundColor, etc. */}
      <FlexBetween gap="1.75rem"> {/* gap beteen items in navbar (like different divs) */}
        <Typography // Typography is a component from material ui library to show text in different styles (this one is for showing logo)
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)" // clamp is a css function to set min, max and default value for a property
          color="test" // you can pass color name, hex code or rgb value
          onClick={() => navigate("/newsfeed")} // navigate to home page when user clicks on logo
          sx={{ // to change color of logo when user hovers on it
            "&:hover": {
              color: primaryLight, // primary light color from theme
              cursor: "pointer", // to show pointer when user hovers on logo
            },
          }}
        >
          MergeMinds
        </Typography>        
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? ( // if screen is not mobile then show these icons
        <FlexBetween gap="2rem"> {/* gap from search bar -> 2rem is equal to 32px */}        
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate(`/submission/${user._id}`)} // navigate to submission page when user clicks on submit button
            startIcon={<AddIcon />} // Add the plus icon using the startIcon prop
          >
            Submit Idea
          </Button>
          <IconButton onClick={() => dispatch(setMode())}> {/* dispatch setMode action when user clicks on dark/light mode icon */}
            {theme.palette.mode === "dark" ? ( // when setMode changes state.mode in redux store, theme.palette.mode will change too (useMemo in App.js calls themeSettings when state.mode changes)
              <DarkMode sx={{ fontSize: "25px" }} /> // dark mode icon will be light color when theme.palette.mode is dark
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} /> // dark mode icon will be dark color when theme.palette.mode is light
            )}
          </IconButton>   
          <IconButton>
            <Badge badgeContent={user.mergeCoins} color="warning" max={999}>
              <Paid onClick={() => navigate(`/token/${user._id}`)}  sx={{ fontSize: "25px" }} />
            </Badge>
          </IconButton>              
          <Message sx={{ fontSize: "23px" }} /> 
          {/* <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} /> */}
          <FormControl variant="standard" value={fullName}> {/* Dropdown menu for user's full name and log out */}
            <Select
              value={fullName}
              sx={{ // to change style of dropdown menu we can give css properties with sx
                backgroundColor: neutralLight,
                width: "170px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem", //0.25 from top bottom and 1 from left right
                "& .MuiSvgIcon-root": { // to change style of dropdown icon
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": { // to change style of dropdown menu when user clicks on it
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem onClick={() => navigate(`/mergeProfilePage/${user._id}`)} value={fullName}> {/* not actually a menu item (can't select), just to show user's full name */}
                <Typography>{fullName}</Typography> {/* show name in dropdown menu */}
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem> {/* dispatch setLogout action when user clicks on log out */}
            </Select>
          </FormControl>
        </FlexBetween>
      ) : ( // if screen is mobile then show menu icon to open mobile menu
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu /> {/* Menu is an icon from material ui library */}
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && ( // if screen is mobile and mobile menu is toggled then show mobile menu
        <Box // open a box to show mobile menu
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background} // background color from theme
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem"> {/* not using FlexBetween because we don't want gap between items */}
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}  // close mobile menu when user clicks on close icon
            >
              <Close /> {/* Close is an icon from material ui library */}
            </IconButton>
          </Box>

          {/* MENU ITEMS (Same with NAVBAR items with little bit css changes */} 
          <FlexBetween
            display="flex"
            flexDirection="column" // to show menu items in one column
            justifyContent="center"
            alignItems="center"
            gap="3rem" // gap between menu items -> little more than navbar items
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem onClick={() => navigate(`/mergeProfilePage/${user._id}`)} value={fullName}  >
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
