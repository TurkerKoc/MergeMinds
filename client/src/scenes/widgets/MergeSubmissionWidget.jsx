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
    IconButton,
  } from "@mui/material";
  import {    
    EditOutlined,
    DeleteOutlined, 
  } from "@mui/icons-material";
  import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // for perticular icons you can import them like this
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  import { useEffect } from "react";
  import Dropzone from "react-dropzone"; // Dropzone is a library to handle file uploads (like profile picture)
  import FlexBetween from "components/FlexBetween";
  import { is } from "date-fns/locale";
  import { useNavigate } from "react-router-dom";

  
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
    const [image, setImage] = useState("");
    const navigate = useNavigate();


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
      formData.append("priceId", "64a1eb2e03e50005ceafe234");
      if (image) {
        formData.append("picturePath", image.name);
        formData.append('picture', image);
      }

      
      const response = await fetch(`http://localhost:3001/mergePosts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      
      dispatch(setPosts({ posts: data }));
      navigate("/newsfeed");
      
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
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <p>Add Image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>                  
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
  
          <Button
            disabled={!description || !title || !applicantNumber || !category || !location || !selectedIsHidden}
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
      </WidgetWrapper>    );
  };
  
  export default MergeSubmissionWidget;
  