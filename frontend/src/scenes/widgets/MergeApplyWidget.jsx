import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
import { Box, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state"; // setLogin is an action from state.js
import { useNavigate } from "react-router-dom";


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
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // we will use dispatch to dispatch actions to redux store
  const [notEnoughCoins, setNotEnoughCoins] = useState(false); // State to track not enough coins warning
  const handleFormSubmit = async (values, onSubmitProps) => {
    const updatedMergeCoins = userMergeCoins - applicationPrice;
    // console.log(updatedMergeCoins);
    if (updatedMergeCoins < 0) {
      setNotEnoughCoins(true); // Show warning if not enough coins
      //setFormError("You do not have enough MergeCoins to apply to this post.");
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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          onClose();
        } else {
          setFormError("An error occurred while submitting the form.");
        }

        //Update mergeCoins
        const curData = { mergeCoins: updatedMergeCoins };
        const mergeUserResponse = await fetch(`http://localhost:3001/mergeUsers/mergeCoins/${userId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(curData), // we will send the form data as json
        });
        const mergeUser = await mergeUserResponse.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
        // console.log(mergeUser.user);
        if (mergeUserResponse.ok) {
          dispatch(setUser({ user: mergeUser.user }));
          onResult();
          onClose();
        } else {
          setFormError("An error occurred while submitting the form.");
        }



        //create chat
        // console.log("Creating chat: ", ideaPostUserId, userId)
        const chatData = { firstId: ideaPostUserId, secondId: userId };
        console.log(token);
        const chatResponse = await fetch(`http://localhost:3001/mergeChat/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatData), // we will send the form data as json
        });
        const chatInfo = await chatResponse.json(); // we will get the logged in user from backend (backend will send the logged in user as json)

        if (chatResponse.ok) {
          onClose();
        } else {
          setFormError("An error occurred while submitting the form.");
        }




        //create message
        const curTextMessage = "Hi, I want to apply your Idea!!\n\nMy Cover Letter:\n" + values.coverLetter;
        const messageData = new FormData();
        messageData.append("senderId", userId);
        messageData.append("text", curTextMessage);
        messageData.append("chatId", chatInfo._id);

        const messageResponse = await fetch("http://localhost:3001/mergeMessages", {
          method: "POST",
          body: messageData,
          headers: { Authorization: `Bearer ${token}` }
        });


        if (messageResponse.ok) {
          onClose();
        }
        else {
          setFormError("An error occurred while submitting the form.");
        }

        const curTextMessage2 = "http://localhost:3001/assets/" + values.resume[0].name;
        const messageData2 = new FormData();
        messageData2.append("senderId", userId);
        messageData2.append("text", curTextMessage2);
        messageData2.append("chatId", chatInfo._id);
        const messageResponse2 = await fetch("http://localhost:3001/mergeMessages", {
          method: "POST",
          body: messageData2,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (messageResponse2.ok) {
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
    <div>
      <Dialog open={notEnoughCoins} onClose={() => setNotEnoughCoins(false)}>
        <DialogTitle>Not Enough Merge Coins</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You don't have enough merge coins to enroll in this webinar.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotEnoughCoins(false)}>Close</Button>
          {/* add buy button to redirect to buy merge coins page */}
          <Button onClick={() => navigate(`/token/${userId}`)}>Buy Merge Coins</Button>
        </DialogActions>
      </Dialog>
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
    </div>
  );
};

export default MergeApplyWidget;
