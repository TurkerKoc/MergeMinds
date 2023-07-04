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

const MergeApplyWidget = ({ userMergeCoins, applicationPrice, open, onClose, userId, ideaPostId, isApplied, setIsApplied }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { palette } = useTheme();
  const [formError, setFormError] = useState(null);
  const dispatch = useDispatch();

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
        const response = await fetch(`http://localhost:3001/mergePosts/apply/${ideaPostId}/${userId}`, {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          onClose();
        } else {
          setFormError("An error occurred while submitting the form.");
        }

        const curData = new FormData();
        curData.append("mergeCoins", updatedMergeCoins); 
        const updateUserCoinResponse = await fetch(`http://localhost:3001/mergeWebinars/user/${userId}`, {
          method: "PATCH",
          body: curData,
        });

        if (updateUserCoinResponse.ok) {
          const curUser = await updateUserCoinResponse.json();  
          dispatch(
            setUser({ // setLogin is an action from state.js
              user: curUser,
            })
          );
          setIsApplied(true);
          onClose();
        } else {
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
