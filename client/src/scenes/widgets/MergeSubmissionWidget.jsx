import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    useMediaQuery,
    Select,
    MenuItem,
    TextField,
  } from "@mui/material";
  import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // for perticular icons you can import them like this
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  import { useEffect } from "react";
  import Dropzone from "react-dropzone"; // Dropzone is a library to handle file uploads (like profile picture)
  import FlexBetween from "components/FlexBetween";
import { is } from "date-fns/locale";
  
  const MergeSubmissionWidget = ({id}) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
  
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [applicantNumber, setApplicantNumber] = useState("");
    const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");
    const [description, setSubmission] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedIsHidden, setSelectedIsHidden] = useState("");
    const [pictureName, setPictureName] = useState("");

    const getCategories = async () => {
      const response = await fetch(`http://localhost:3001/mergePosts/allCategories`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const categories = await response.json();
      setCategory(categories);
    };

    const getLocations = async () => {
      const response = await fetch(`http://localhost:3001/mergePosts/allLocations`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const locations = await response.json();
      setLocation(locations);
    };
  
    useEffect(() => {
      getCategories();
      getLocations();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", id);
      formData.append("locationId", selectedLocation);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("isHidden", selectedIsHidden);
      formData.append("prepaidApplicants", applicantNumber);
      formData.append("categoryId", selectedCategory);
      formData.append("priceId", "6484ca89b55d4d75a7d50d35");
      formData.append("picturePath", pictureName);
      formData.append('picture', pictureName);

      
      
  
      const response = await fetch(`http://localhost:3001/mergePosts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      
      dispatch(setPosts({ posts: data }));
      // setCategory("");
      // setApplicantNumber("");
      // setTitle("");
      // //setDescription("");
      // //setPost("");
      // setSubmission("");
      
    };

    return (
      <WidgetWrapper>
        <Box>
          <Typography>Choose Category</Typography>
          {Array.isArray(category) && category.length > 0 ? (
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          >
            {category.map((cat) => (
              <MenuItem value={cat._id}>
                {cat.domain}
              </MenuItem>
            ))}
          </Select>
          ) : (
            <Typography>No categories found.</Typography>
          )}
          <Typography>Choose Location</Typography>
          {Array.isArray(location) && location.length > 0 ? (
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          >
            {location.map((loc) => (
              <MenuItem value={loc._id}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
          ) : (
            <Typography>No categories found.</Typography>
          )}
          <Typography>Do you want your post as Hidden?</Typography>
          <Select
            value={selectedIsHidden}
            onChange={(e) => setSelectedIsHidden(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          >
              <MenuItem value="true">
                {"Yes"}
              </MenuItem>
              <MenuItem value="false">
                {"No"}
              </MenuItem>
          </Select>
  
          <Typography>Prepaid Applicant Number</Typography>
          <TextField
            value={applicantNumber}
            onChange={(e) => setApplicantNumber(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          />
  
          <Typography>Title</Typography>
          <TextField
            placeholder="Type catching attention title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          />
  
          <Typography>Description</Typography>
          <TextField
            placeholder="Describe your idea here..."
            value={description}
            //onChange={(e) => setDescription(e.target.value)}
            onChange = {(e) => setSubmission(e.target.value)}
            multiline
            rows={10}
            sx={{ width: "100%", mb: 2 }}
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
                //setFieldValue("picture", acceptedFiles[0]) // setFieldValue -> set the value of picture field to the first file that user uploads
                setPictureName(acceptedFiles[0].name)
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
                  {!pictureName ? ( // if the user has not uploaded a picture then show this text
                    <p>Add Picture Here</p>
                  ) : ( // if the user has uploaded a picture then show file name
                    <FlexBetween>
                      <Typography>{pictureName}</Typography> 
                      <EditOutlinedIcon />
                    </FlexBetween>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>
  
          <Button
            disabled={!description || !title || !applicantNumber || !category}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              mt: "1rem",
            }}
          >
            POST
          </Button>
        </Box>
        <Typography>{selectedCategory}</Typography>
        <Typography>{selectedLocation}</Typography>
        <Typography>{selectedIsHidden}</Typography>
        <Typography>{applicantNumber}</Typography>
        <Typography>{title}</Typography>
        <Typography>{description}</Typography>
        <Typography>{pictureName}</Typography>  
        <Typography>{id}</Typography>      
      </WidgetWrapper>    );
  };
  
  export default MergeSubmissionWidget;
  