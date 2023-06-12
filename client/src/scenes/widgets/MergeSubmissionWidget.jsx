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
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setSubmissions } from "state";
  
  const MergeSubmissionWidget = () => {
    const dispatch = useDispatch();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
  
    const [category, setCategory] = useState("");
    const [applicantNumber, setApplicantNumber] = useState("");
    const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");
    const [description, setSubmission] = useState("");


    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("category", category);
      formData.append("applicantNumber", applicantNumber);
      formData.append("title", title);
      formData.append("description", description);
  
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json();
      
      dispatch(setSubmissions({ posts }));
      setCategory("");
      setApplicantNumber("");
      setTitle("");
      //setDescription("");
      //setPost("");
      setSubmission("");
    };
  
    return (
      <WidgetWrapper>
        <Box>
          <Typography>Choose Category</Typography>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ width: "100%", mb: 2 }}
          >
            {/* Replace with your categories */}
            <MenuItem value={"IT"}>Information Technologies</MenuItem>
            <MenuItem value={"food"}>Food Industry</MenuItem>
            <MenuItem value={"music"}>Music Industry</MenuItem>
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
  
          <Button
            disabled={!description || !title || !applicantNumber || !category}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </Box>
      </WidgetWrapper>
    );
  };
  
  export default MergeSubmissionWidget;
  