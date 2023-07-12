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
import { setUser } from "state";
import { useEffect } from "react";
import Dropzone from "react-dropzone"; // Dropzone is a library to handle file uploads (like profile picture)
import FlexBetween from "components/FlexBetween";
import { is } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Paid } from "@mui/icons-material";
import Badge from '@mui/material/Badge';
import { Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { set } from "date-fns";

const MergeSubmissionWidget = ({id, savedDraftData}) => {
  const dispatch = useDispatch();
  const { mergeCoins, _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const [formError, setFormError] = useState(null);

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [applicantNumber, setApplicantNumber] = useState(0);
  const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const [description, setSubmission] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIsHidden, setSelectedIsHidden] = useState("");
  const [image, setImage] = useState("");
  const [submissionPrice, setSubmissionPrice] = useState(4);
  const navigate = useNavigate();

  const getMergeUser = async () => {
    const response = await fetch(`http://localhost:3001/mergeUsers/${_id}`, {
        method: "GET",
    });
    const mergeUser = await response.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
    if (response.ok) {
        dispatch(setUser({user: mergeUser}));
    }
};

  const handleApplicantNumberChange = (value) => {
    if (value === "") {
      selectedIsHidden === "true" ? setSubmissionPrice(8) : setSubmissionPrice(4); // Set the default submission price if the input is empty
    } else {
      const intValue = parseInt(value, 10); // Convert the value to an integer
      if (intValue > 0) {
        const previousValue = applicantNumber;
        const priceDifference = (intValue - previousValue) * 1; // Calculate the difference in price
        setSubmissionPrice((prevPrice) => prevPrice + priceDifference); // Update the submission price
      }
    }
    setApplicantNumber(value);
  };
  const handleIsHiddenChange = (value) => {
    if(value === "true" && (selectedIsHidden === "false" || selectedIsHidden === "")) {
      setSubmissionPrice(submissionPrice + 4);
    }
    else if(value === "false" && (selectedIsHidden === "true")) {
      setSubmissionPrice(submissionPrice - 4);
    }
    setSelectedIsHidden(value);
  };

  useEffect(() => {
    if (savedDraftData) {
      setSelectedCategory(savedDraftData.selectedCategory || "");
      setSelectedLocation(savedDraftData.selectedLocation || "");
      setSelectedIsHidden(savedDraftData.selectedIsHidden || "");
      setApplicantNumber(savedDraftData.applicantNumber || "");
      setTitle(savedDraftData.title || "");
      setSubmission(savedDraftData.description || "");      
    }
  }, [id, savedDraftData]); 

  useEffect(() => {
    const formData = {
      selectedCategory,
      selectedLocation,
      selectedIsHidden,
      applicantNumber,
      title,
      description,
    };

    localStorage.setItem("submissionFormData", JSON.stringify(formData));
  }, [
    selectedCategory,
    selectedLocation,
    selectedIsHidden,
    applicantNumber,
    title,
    description,
  ]);

  const getCategories = async () => {
    const response = await fetch(`http://localhost:3001/mergePosts/allCategories`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const categories = await response.json();
    const filteredCategories = categories.filter(category => category.domain !== 'Admin');

    setCategory(filteredCategories);
  };

  const getLocations = async () => {
    const response = await fetch(`http://localhost:3001/mergePosts/allLocations`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const locations = await response.json();
    const filteredLocations = locations.filter(location => location.name !== 'Admin');
    setLocation(filteredLocations);
  };

  useEffect(() => {
    getCategories();
    getLocations();
    getMergeUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePost = async () => {
    const userMergeCoins = mergeCoins;
    const updatedMergeCoins = userMergeCoins - submissionPrice;
    if (updatedMergeCoins < 0) {
      setFormError("You do not have enough MergeCoins to apply to this post.");
      return;
    }


    const formData = new FormData();
    formData.append("userId", id);
    formData.append("locationId", selectedLocation);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isHidden", selectedIsHidden);
    formData.append("prepaidApplicants", applicantNumber);
    formData.append("categoryId", selectedCategory);
    formData.append("priceId", "64a1eb2e03e50005ceafe231");
    if (image) {
      formData.append("picturePath", image.name);
      formData.append('picture', image);
    }

    try {
      const response = await fetch(`http://localhost:3001/mergePosts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(setPosts({ posts: data }));
      } else {
        setFormError("An error occurred while submitting the form.");
      }

      const curData = { mergeCoins: updatedMergeCoins };
      const mergeUserResponse = await fetch(`http://localhost:3001/mergeUsers/mergeCoins/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(curData), // we will send the form data as json
      });
      const mergeUser = await mergeUserResponse.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
      console.log(mergeUser.user);
      if (mergeUserResponse.ok) {
        dispatch(setUser({ user: mergeUser.user }));
      }
      else {
        setFormError("An error occurred while submitting the form.");
      }
      localStorage.removeItem('submissionFormData');
      navigate("/newsfeed");
    } catch (error) {
      console.log(error);
      setFormError("An error occurred while submitting the form.");
    }
  };

  return (
    <WidgetWrapper>
      <Box>
        <Typography sx={{ marginBottom: '1rem' }}>Choose Category</Typography>
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
        <Typography sx={{ marginBottom: '1rem' }}>Choose Location</Typography>
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
        <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>Do you want your post as Hidden?
          <Tooltip title={<Typography style={{ fontSize: '0.8rem' }}>
              Enabling the hidden post selection feature ensures that only 
              individuals who have applied for your idea can access and view 
              its description, keeping it hidden from others.
          </Typography>} >
              <HelpIcon style={{ fontSize: '1.1rem', marginLeft: '0.5rem' }}/>
          </Tooltip>
        </Typography>
        <Select
          value={selectedIsHidden}
          onChange={(e) => handleIsHiddenChange(e.target.value)}
          sx={{ width: "100%", mb: 2 }}
        >
          <MenuItem value="true">
            {"Yes"}
            <Badge badgeContent={4} color="warning" style={{ transform: 'scale(0.8)' }}>
              <Paid sx={{ fontSize: "25px"}} />
            </Badge>
          </MenuItem>
          <MenuItem value="false">
            {"No"}
          </MenuItem>
        </Select>
        <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          Prepaid Applicant Number
          <Tooltip title={<Typography style={{ fontSize: '0.8rem' }}>
          This represents the maximum number of applicants who can apply for your idea without spending mergecoins.
          The idea owner covers application fees for these applicants.
          </Typography>} >
              <HelpIcon style={{ fontSize: '1.1rem', marginLeft: '0.5rem' }}/>
          </Tooltip>
        </Typography>
        <FlexBetween gap="0.5rem" alignItems="center">
          <TextField
            value={applicantNumber}
            onChange={(e) => handleApplicantNumberChange(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          />
          <Badge badgeContent={1} color="warning" >
            <Paid sx={{ fontSize: "25px", mb: 2 }} />
          </Badge>
        </FlexBetween>
        <Typography sx={{ marginBottom: '1rem' }}>Title</Typography>
        <TextField
          placeholder="Type catching attention title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ width: "100%", mb: 2 }}
        />

        <Typography sx={{ marginBottom: '1rem' }}>Description</Typography>
        <TextField
          placeholder="Describe your idea here..."
          value={description}
          //onChange={(e) => setDescription(e.target.value)}
          onChange={(e) => setSubmission(e.target.value)}
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
        {formError && (
          <Typography color="error" sx={{ m: "1rem 0" }}>
            {formError}
          </Typography>
        )}
        <Button
          disabled={!description || !title || !applicantNumber || !category || !location || !selectedIsHidden}
          onClick={handlePost}
          variant="contained"
          sx={{
            borderRadius: "3rem",
            mt: "1rem",
            display: 'flex', gap: '5px'
          }}
        >
          post
          <Badge badgeContent={submissionPrice} color="warning">
            <Paid sx={{ fontSize: "25px" }} />
          </Badge>
        </Button>
      </Box>
    </WidgetWrapper>);
};

export default MergeSubmissionWidget;
