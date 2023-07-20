import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material"; // components from material ui library
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // for perticular icons you can import them like this
import { Formik } from "formik"; // Formik is a library to handle forms in react
import * as yup from "yup"; // yup is a library to validate forms
import { useNavigate } from "react-router-dom"; // useNavigate used for navigation between pages
import { useDispatch } from "react-redux"; // useDispatch used for dispatching actions to redux store
import { setLogin } from "state"; // setLogin is an action from state.js
import Dropzone from "react-dropzone"; // Dropzone is a library to handle file uploads (like profile picture)
import FlexBetween from "components/FlexBetween"; // FlexBetween is a component we created in mern-social-media/client/src/components/FlexBetween.jsx
import {useEffect} from "react";

// yup validation schema for register form
const registerSchema = yup.object().shape({ //required is a yup function to show error message if user doesn't enter anything in that field
  name: yup.string().required("required"),
  surname: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"), // yup will show this error message if user enters invalid email
  password: yup.string().required("required"),
  profileSummary: yup.string().required("required"),
  websiteLink: yup.string(),
  picture: yup.mixed().required("required"), 
});

// yup validation schema for login form
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

// initial values for register form
const initialValuesRegister = {
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
  profileSummary: "",
  websiteLink: "",
  picture: "",
};

// initial values for login form
const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login"); // pageType is a state to show login or register form
  const { palette } = useTheme(); // we will use theme from theme.js file
  const dispatch = useDispatch(); // we will use dispatch to dispatch actions to redux store
  const navigate = useNavigate(); // we will use navigate to navigate between pages
  const isNonMobile = useMediaQuery("(min-width:600px)"); // useMediaQuery is a hook to check if the screen is mobile or not (600px is the breakpoint for mobile screens)
  const isLogin = pageType === "login"; // isLogin is a boolean to check if the pageType is login or not
  const isRegister = pageType === "register"; // isRegister is a boolean to check if the pageType is register or not
  const [formError, setFormError] = useState(null); // error is a state to show error message

  const register = async (values, onSubmitProps) => {
    // console.log("on register");
    setFormError(null); // we will set formError to null before submitting the form
    // this allows us to send form info with image
    const formData = new FormData(); // FormData is a javascript class to send form data with images (like profile picture)
    for (let value in values) { // for loop to append all the values to formData
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name); // we will append picturePath to formData

    const savedUserResponse = await fetch( // we will send form data to backend
      "http://localhost:3001/mergeAuth/register", // this is the register url of backend
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json(); // we will get the saved user from backend (backend will send the saved user as json)
    onSubmitProps.resetForm(); // we will reset the form after submitting
    
    // console.log(savedUser)
    //if user is saved backend will return 201 status code
    if (!savedUserResponse.ok) { // if the user is not saved then we will show the error message}
      setFormError(savedUser.error); // if the user is not saved then we will show the error message
    }
    else if (savedUserResponse.ok) { // if the user is saved then we will dispatch setLogin action to redux store and navigate to home page      
      setPageType("login"); // we will change the pageType to login after submitting
    }
  };

  const login = async (values, onSubmitProps) => {
    setFormError(null); // we will set formError to null before submitting the form
    const loggedInResponse = await fetch("http://localhost:3001/mergeAuth/login", { // we will send form data to backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values), // we will send the form data as json
    });
    const loggedIn = await loggedInResponse.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
    onSubmitProps.resetForm(); // we will reset the form after submitting
    if(!loggedInResponse.ok) {
      setFormError(loggedIn.msg); // if the user is not logged in then we will show the error message      
    }
    else if (loggedInResponse.ok) { // if the user is logged in then we will dispatch setLogin action to redux store and navigate to home page
      // console.log(loggedIn)
      dispatch(
        setLogin({ // setLogin is an action from state.js
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/newsfeed"); // we will navigate to home page
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => { // this function will be called when user submits the form -> onSubmitProps coming from Formik
    // console.log("on handleFormSubmit");
    if (isLogin) await login(values, onSubmitProps); // if the pageType is login then call login function
    if (isRegister) await register(values, onSubmitProps); // if the pageType is register then call register function        
  };

  // useEffect(() => { // this function will be called when the pageType changes
  //   console.log("Checking page type");
  //   console.log(isLogin);
  //   console.log(isRegister);
  //   console.log(pageType);
  // }, [isLogin, isRegister, pageType]);

  return (
    <Formik // Formik is a library to handle forms in react from https://formik.org/docs/overview
      onSubmit={handleFormSubmit} // onSubmit is a function that will be called when user submits the form
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister} // initialValues is an object that contains initial values for the form
      validationSchema={isLogin ? loginSchema : registerSchema} // validationSchema is a yup schema to validate the form
      enableReinitialize={true} // Enable reinitialization when the initial values change
    >
      {({
        values, // values is an object that contains values for each field
        errors, // errors is an object that contains errors for each field
        touched, // touched is a boolean to check if the user has touched the field or not
        handleBlur, // handleBlur is a function that will be called when user blurs out of a field
        handleChange, // handleChange is a function that will be called when user changes the value of a field
        handleSubmit, // handleSubmit is a function that will be called when user submits the form
        setFieldValue, // setFieldValue is a function to set the value of a field
        resetForm, // resetForm is a function to reset the form
      }) => ( // these are the props that we get from Formik
        <form onSubmit={handleSubmit}>
          <Box
            display="grid" // display grid to show the form in a grid
            gap="30px" // gap between each grid item
            gridTemplateColumns="repeat(4, minmax(0, 1fr))" // gridTemplateColumns to show 4 columns in the grid -> minmax(0, 1fr) means each column will take 1fr space and minimum width is 0
            sx={{ // sx is a prop from material ui to add styles
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }, // in mobile screens we want each field to take 4 columns and in non mobile screens we want each field to take 1 column
            }}
          >
            {isRegister && ( // if the pageType is register then show these fields
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name} // save entered value in values.firstName
                  name="name" // name of the field
                  error={ // error prop is a boolean to show error message if the field is touched and has an error
                    Boolean(touched.name) && Boolean(errors.name) // if the field is touched and has an error then show error message
                  }
                  helperText={touched.name && errors.name} // helperText is the error message
                  sx={{ gridColumn: "span 2" }} // in larger screens we want the field to take 2 columns and in smaller screens we want the field to take 4 columns (defined above)
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.surname}
                  name="surname"
                  error={Boolean(touched.surname) && Boolean(errors.surname)}
                  helperText={touched.surname && errors.surname}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Profile Summary"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.profileSummary}
                  name="profileSummary"
                  error={
                    Boolean(touched.profileSummary) && Boolean(errors.profileSummary)
                  }
                  helperText={touched.profileSummary && errors.profileSummary}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                    label="Website Link"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.webSiteLink}
                    name="websiteLink"
                    error={
                        Boolean(touched.websiteLink) && Boolean(errors.websiteLink)
                    }
                    helperText={touched.websiteLink && errors.websiteLink}
                    sx={{ gridColumn: "span 4" }}
                />
                <Box /* Box to cover upload image field */
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`} /* border for the box from theme */
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone // Dropzone is a library to handle file uploads from https://react-dropzone.js.org/
                    acceptedFiles=".jpg,.jpeg,.png" // acceptedFiles is a string to accept only these file types
                    multiple={false} // multiple is a boolean to accept multiple files or not
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0]) // setFieldValue -> set the value of picture field to the first file that user uploads
                    }
                  >
                    {({ getRootProps, getInputProps }) => ( // these are the props that we get from Dropzone library to handle file uploads
                      <Box
                        {...getRootProps()} // getRootProps is a function that returns props to be spread on the root element
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} /> 
                        <input 
                          tabIndex={-1} 
                          autoComplete="off" 
                          style={{ position: 'absolute', opacity: 0 }} 
                          value={values.picture ? values.picture.name : ''} 
                          onBlur={handleBlur} 
                          onChange={handleChange} 
                          name="picture"
                        />
                                          {!values.picture ? ( // if the user has not uploaded a picture then show this text
                          <p>Add Picture Here</p>
                        ) : ( // if the user has uploaded a picture then show file name
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography> 
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}

                      </Box>
                    )}
                  </Dropzone>
                                  {touched.picture && errors.picture ? (  
                  <Typography color="error">{errors.picture}</Typography>  
                ) : null}
                </Box>

              </>
            )} {/* end of isRegister */}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button //submit button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"} {/* if the pageType is login then show text as LOGIN else show REGISTER */}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login"); // if the pageType is login then change it to register else change it to login
                resetForm(); // reset the form delete all the values etc.
                setFormError(""); // reset the form error
              }}
              sx={{ // underlined button
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here." // if the pageType is login then show this text
                : "Already have an account? Login here."} {/* if the pageType is register then show this text */}
            </Typography>
          </Box>
          { formError && (
          <Typography 
            color="error"
            sx={{ m: "1rem 0", }}>
              {formError}
          </Typography>)} {/* if there is an error then show error message */}
        </form>
      )}
    </Formik>
  );
};

export default Form;

