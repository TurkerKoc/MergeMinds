import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Box, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state"; // setLogin is an action from state.js



const applySchema = yup.object().shape({
  coverLetter: yup.string().required("Cover letter is required"),
  resume: yup
    .mixed()
    .test("fileRequired", "Resume file is required", (value) => {
      return value && value[0] && value[0].name !== "";
    }),
});

const initialValuesApply = {
  coverLetter: "",
  resume: null,
};

const MergeApplyWidget = ({ userMergeCoins, applicationPrice, open, onClose, userId, ideaPostId, ideaPostUserId, onResult }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { palette } = useTheme();
  const [formError, setFormError] = useState(null);
  const { user } = useSelector((state) => state.user);
  const {token} = useSelector((state) => state.token);
  const dispatch = useDispatch(); // we will use dispatch to dispatch actions to redux store

  const handleFormSubmit = async (values, onSubmitProps) => {
    const updatedMergeCoins = userMergeCoins - applicationPrice;
    console.log(updatedMergeCoins);
    if(updatedMergeCoins < 0) {
      setFormError("You do not have enough MergeCoins to apply to this post.");
    }
    else { 
      if (!values.resume || !values.resume[0] || !values.resume[0].name) {
        setFormError("Please upload a resume file.");
        return;
      }
      
      const formData = new FormData();
      formData.append("coverLetter", values.coverLetter);
      formData.append("resume", values.resume[0]);
      formData.append("resumePath", values.resume[0].name);
  
      try {
        //Create application
        const response = await fetch(`http://localhost:3001/mergePosts/apply/${ideaPostId}/${userId}`, {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          onClose();
        } else {
          setFormError("An error occurred while submitting the form.");
        }

        //Update mergeCoins
        const curData = {mergeCoins: updatedMergeCoins};
        const mergeUserResponse = await fetch(`http://localhost:3001/mergeUsers/mergeCoins/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(curData), // we will send the form data as json
        });
        const mergeUser = await mergeUserResponse.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
        console.log(mergeUser.user);
        if (mergeUserResponse.ok) {
          dispatch(setUser({ user: mergeUser.user }));
          onResult();
          onClose();
        } else {
          setFormError("An error occurred while submitting the form.");
        }
        
        //create chat
        console.log("Creating chat: ", ideaPostUserId, userId)
        const chatData = {firstId: ideaPostUserId, secondId: userId};
        const chatResponse = await fetch(`http://localhost:3001/mergeChat/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatData), // we will send the form data as json
        });
        const chatInfo = await chatResponse.json(); // we will get the logged in user from backend (backend will send the logged in user as json)

        if(chatResponse.ok) {
          onClose();
        } else {
          setFormError("An error occurred while submitting the form.");
        }

        //create message
        const curTextMessage = "User has applied to your post.\nCover Letter: \n" + values.coverLetter + "\nResume: " + values.resume[0].name + "\n";
        const messageData = {chatId: chatInfo._id, senderId: userId, text: curTextMessage};
        const messageResponse = await fetch(`http://localhost:3001/mergeMessages/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData), // we will send the form data as json
        });

        if(messageResponse.ok) {
          onClose();
        }
        else {
          setFormError("An error occurred while submitting the form.");
        }  
      } catch (error) {
        setFormError("An error occurred while submitting the form.");
      }

      onSubmitProps.resetForm();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Apply</DialogTitle>
      <DialogContent style={{ minWidth: "500px", minHeight: "400px" }}>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesApply}
          validationSchema={applySchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box p="0.3rem">
                <TextField
                  label="Cover Letter"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.coverLetter}
                  name="coverLetter"
                  error={touched.coverLetter && Boolean(errors.coverLetter)}
                  helperText={touched.coverLetter && errors.coverLetter}
                  multiline
                  rows={13}
                  fullWidth                  
                />
              </Box>
              <Box gridColumn="span 4" border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" p="1rem" mt="1rem">
                <Dropzone
                  acceptedFiles=".pdf"
                  multiple={false}
                  onDrop={(acceptedFiles) => setFieldValue("resume", acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" sx={{ "&:hover": { cursor: "pointer" } }}>
                      <input {...getInputProps()} />
                      {!values.resume ? (
                        <p>Add Resume Here</p>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.resume[0].name}</Typography>
                          <EditOutlinedIcon />
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
              {touched.resume && errors.resume && (
                  <Typography color="error" sx={{ mt: "1rem 0" }}>
                    {errors.resume}
                  </Typography>
              )}
              {formError && (
                <Typography color="error" sx={{ m: "1rem 0" }}>
                  {formError}
                </Typography>
              )}
              <Box>
                <Button fullWidth type="submit" sx={{ m: "2rem 0", p: "1rem", backgroundColor: palette.primary.main, color: palette.background.alt, "&:hover": { color: palette.primary.main } }}>
                  Apply
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MergeApplyWidget;
