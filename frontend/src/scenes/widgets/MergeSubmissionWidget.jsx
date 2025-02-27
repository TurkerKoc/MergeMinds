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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // for particular icons you can import them like this
import WidgetWrapper from "components/WidgetWrapper";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPosts} from "state";
import {setUser} from "state";
import {useEffect} from "react";
import Dropzone from "react-dropzone"; // Dropzone is a library to handle file uploads (like a profile picture)
import FlexBetween from "components/FlexBetween";
import {useNavigate} from "react-router-dom";
import {Paid} from "@mui/icons-material";
import Badge from '@mui/material/Badge';
import {Tooltip} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const MergeSubmissionWidget = ({id, savedDraftData}) => {
    const dispatch = useDispatch();
    const {mergeCoins, _id} = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const {palette} = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const [formError, setFormError] = useState(null);
    const [notEnoughCoins, setNotEnoughCoins] = useState(false)
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [applicantNumber, setApplicantNumber] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setSubmission] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedIsHidden, setSelectedIsHidden] = useState("");
    const [image, setImage] = useState("");
    const [submissionPrice, setSubmissionPrice] = useState(4);
    const navigate = useNavigate();
    const [isDraftSaved, setIsDraftSaved] = useState(false); // State to track whether the draft is saved or not
    const [isFormDataPresent, setIsFormDataPresent] = useState(false);
    const [locationInputValue, setLocationInputValue] = useState("");
    const [isLocationSelectOpen, setIsLocationSelectOpen] = useState(false);
    const [categoryInputValue, setCategoryInputValue] = useState("");
    const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);

    const handleLocationSelect = (e) => {
        setSelectedLocation(e.target.value);
        const selectedOption = location.find((cat) => cat._id === e.target.value);
        setLocationInputValue(selectedOption.name);
    }

    const handleCategorySelect = (e) => {
        setSelectedCategory(e.target.value);
        const selectedOption = category.find((cat) => cat._id === e.target.value);
        setCategoryInputValue(selectedOption.domain);
    }

    const getMergeUser = async () => {
        const response = await fetch(`http://localhost:3001/mergeUsers/${_id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const mergeUser = await response.json();
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
        if (value === "true" && (selectedIsHidden === "false" || selectedIsHidden === "")) {
            setSubmissionPrice(submissionPrice + 4);
        } else if (value === "false" && (selectedIsHidden === "true")) {
            setSubmissionPrice(submissionPrice - 4);
        }
        setSelectedIsHidden(value);
    };

    const handleLocationInputChange = (event) => {
        setLocationInputValue(event.target.value);
        if (event.target.value.length > 1) {
            getLocations(event.target.value);
        }
        if (event.key === "Enter" || event.key === "Tab") {
            setIsLocationSelectOpen(true);
        }
    };
    const handleCategoryInputChange = (event) => {
        setCategoryInputValue(event.target.value);
        if (event.target.value.length > 1) {
            getCategories(event.target.value);
        }
        if (event.key === "Enter" || event.key === "Tab") {
            setIsCategorySelectOpen(true);
        }
    };

    const getLocation = async (value) => {
        const response = await fetch(`http://localhost:3001/mergePosts/location/${value}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const curLocation = await response.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
        if (response.ok) {
            setLocationInputValue(curLocation.name);
        }
    };
    const getCategory = async (value) => {
        const response = await fetch(`http://localhost:3001/mergePosts/category/${value}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const curCategory = await response.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
        if (response.ok) {
            setCategoryInputValue(curCategory.domain);
        }
    };

    const getCategories = async (value) => {
        const response = await fetch(`http://localhost:3001/mergePosts/categories?query=${value}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
        });
        const categories = await response.json();
        const filteredCategories = categories.filter(category => category.domain !== 'Admin');
        if (filteredCategories.length > 0) {
            setCategory(filteredCategories);
        }
    };
    const getLocations = async (value) => {
        const response = await fetch(`http://localhost:3001/mergePosts/locations?query=${value}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
        });
        const locations = await response.json();
        const filteredLocations = locations.filter(location => location.name !== 'Admin');
        if (filteredLocations.length > 0) {
            setLocation(filteredLocations);
        }
    };    

    const clearForm = () => {
        // Clear state
        setSubmissionPrice(4);
        setSelectedIsHidden("");
        setApplicantNumber(0);
        setTitle("");
        setSubmission("");
        setSelectedCategory("");
        setCategoryInputValue("");
        setLocationInputValue("");
        setSelectedLocation("");
        // Clear local storage
        localStorage.removeItem('submissionFormData');
    };

    const handleClearForm = () => {
        localStorage.removeItem("submissionFormData");
        localStorage.removeItem("availableDraftId");
        clearForm();
        setIsFormDataPresent(false); // Hide the "Clear Form" button after clearing the form
    };

    const handleInputChange = () => {
        const formData = localStorage.getItem("submissionFormData");
        if (formData) {
            setIsFormDataPresent(true);
        } else {
            setIsFormDataPresent(false);
        }
    };

    const handlePost = async () => {
        const isValid = validateFields();

        if (!isValid) {
            return;
        }

        const userMergeCoins = mergeCoins;
        const updatedMergeCoins = userMergeCoins - submissionPrice;
        if (updatedMergeCoins < 0) {
            setNotEnoughCoins(true);
            return;
        }

        const formData = new FormData();
        formData.append("userId", id);
        formData.append("locationId", selectedLocation);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("isHidden", selectedIsHidden);
        // console.log("on post");
        // console.log(typeof selectedIsHidden);
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
                headers: {Authorization: `Bearer ${token}`},
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                dispatch(setPosts({posts: data}));
            } else {
                setFormError("An error occurred while submitting the form.");
            }

            const curData = {mergeCoins: updatedMergeCoins};
            const mergeUserResponse = await fetch(`http://localhost:3001/mergeUsers/mergeCoins/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(curData),
            });
            const mergeUser = await mergeUserResponse.json();
            if (mergeUserResponse.ok) {
                dispatch(setUser({user: mergeUser.user}));
            } else {
                setFormError("An error occurred while submitting the form.");
            }
            const availableDraftId = localStorage.getItem("availableDraftId");
            if (availableDraftId) {
                try {
                    await fetch(`http://localhost:3001/mergeDraftData/${availableDraftId}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            localStorage.removeItem('submissionFormData');
            navigate("/newsfeed");
        } catch (error) {
            console.log(error);
            setFormError("An error occurred while submitting the form.");
        }
    };

    const handleSaveDraft = async () => {
        const draftData = {
            userId: id,
            title,
            description,
            applicantNumber,
            selectedCategory,
            selectedLocation,
            selectedIsHidden,
        };
        // console.log("Saving draft...");
        // console.log(draftData);
        const availableDraftId = localStorage.getItem("availableDraftId") || "";
        // console.log("HEY " + availableDraftId.length);
        // console.log(draftData);
        if (availableDraftId.length === 0) {
            // console.log("availableDraftId is not empty");
            try {
                await fetch("http://localhost:3001/mergeDraftData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(draftData),
                });
                setIsDraftSaved(true); // Set the draft saved state to true
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const response = await fetch(`http://localhost:3001/mergeDraftData/${availableDraftId}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const draftDataExist = await response.json();
                    // console.log("HEYYY" + draftDataExist);
                    if (draftDataExist.length !== 0) {
                        try {
                            await fetch(`http://localhost:3001/mergeDraftData/${availableDraftId}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(draftData),
                            });

                            setIsDraftSaved(true); // Set the draft saved state to true
                        } catch (error) {
                            console.log(error);
                            setFormError("An error occurred while saving the draft.");
                        }
                    } else {
                        try {
                            await fetch("http://localhost:3001/mergeDraftData", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(draftData),
                            });
                            setIsDraftSaved(true); // Set the draft saved state to true
                        } catch (error) {
                            console.log(error);
                        }
                    }
                } else {
                    console.log("Failed to check if draft exists.");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState("");

    const validateFields = () => {
        let isValid = true;
        let errorMessage = "";

        if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(title)) {
            isValid = false;
            errorMessage = "You can't enter an email in the title";
        } else if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(description)) {
            isValid = false;
            errorMessage = "You can't enter an email in the description";
        } else if (/^\+?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{4,6}$/.test(title)) {
            isValid = false;
            errorMessage = "You can't enter a telephone number in the title";
        } else if (/^\+?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{4,6}$/.test(description)) {
            isValid = false;
            errorMessage = "You can't enter a telephone number in the description";
        }

        if (
            !isValid &&
            (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(title) ||
                /^\+?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{4,6}$/.test(title)) &&
            (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(description) ||
                /^\+?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{4,6}$/.test(description))
        ) {
            errorMessage = "You can't enter both an email and a telephone number";
        }

        if (!isValid) {
            setErrorDialogMessage(errorMessage);
            setErrorDialogOpen(true);
        }

        return isValid;
    };

    //to get all categories when text field is empty
    useEffect(() => {
        if (categoryInputValue === "") {
            getCategories("");
        }
    }, [categoryInputValue]);

    //get locations when text field is empty (starting with ab)
    useEffect(() => {
        if (locationInputValue === "") {
            getLocations("ab");
        }
    }, [locationInputValue]);

    //get locations categories and current user when page first rendered
    useEffect(() => {
        getCategories("");
        getLocations("ab");
        getMergeUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    //check whether are there any unsaved data in local storage
    useEffect(() => {
        const formData = localStorage.getItem("submissionFormData");
        // console.log("getting form data");
        // console.log(formData);
        if (formData) {
            // console.log("form data exists");
            // If formData exists in localStorage, show the "Clear Form" button
            setIsFormDataPresent(true);
        } else {
            // console.log("form data does not exist");
            setIsFormDataPresent(false);
        }
    }, []);

    //when any of the values changed, save them to local storage
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

    //get the saved draft data from local storage
    useEffect(() => {        
        // console.log(savedDraftData);
        if (savedDraftData) {
            setSelectedCategory(savedDraftData.selectedCategory || "");
            if (savedDraftData.selectedCategory) {
                getCategory(savedDraftData.selectedCategory);
            }
            setSelectedLocation(savedDraftData.selectedLocation || "");
            if (savedDraftData.selectedLocation) {
                getLocation(savedDraftData.selectedLocation);
            }
            // setSelectedIsHidden(savedDraftData.selectedIsHidden || "");
            // console.log('selected is hidden: ', savedDraftData.selectedIsHidden);
            // console.log(typeof savedDraftData.selectedIsHidden);

            setApplicantNumber(savedDraftData.applicantNumber || 0);
            setTitle(savedDraftData.title || "");
            setSubmission(savedDraftData.description || "");

            setSelectedIsHidden(savedDraftData.selectedIsHidden || "");

            var newSubmissionPrice = 4;
            const isHiddenValue = savedDraftData.selectedIsHidden || "";
            // console.log(isHiddenValue);
            // console.log(typeof isHiddenValue);
            if (isHiddenValue && isHiddenValue === "true") {
                newSubmissionPrice += 4;
            }

            const applicantNumberValue = savedDraftData.applicantNumber || 0;
            if(applicantNumberValue > 0) {
                const intValue = applicantNumberValue // Convert the value to an integer
                if (intValue > 0) {
                    const previousValue = applicantNumber;
                    const priceDifference = (intValue - previousValue) * 1; // Calculate the difference in price
                    newSubmissionPrice += priceDifference;
                }
                setApplicantNumber(intValue);
            }
            setSubmissionPrice(newSubmissionPrice);
        }
    }, [id, savedDraftData]);

    return (
        <WidgetWrapper>
            <Dialog open={notEnoughCoins} onClose={() => setNotEnoughCoins(false)}>
                <DialogTitle>Not Enough Merge Coins</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You don't have enough merge coins to submit this idea.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNotEnoughCoins(false)}>Close</Button>
                    <Button onClick={() => navigate(`/token/${_id}`)}>Buy Merge Coins</Button>
                </DialogActions>
            </Dialog>
            <Box>
                <Typography sx={{marginBottom: '1rem'}}>Choose Category</Typography>
                {Array.isArray(category) && category.length > 0 ? (
                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                        <TextField
                            type="text"
                            value={categoryInputValue}
                            onChange={handleCategoryInputChange}
                            placeholder="Type to filter categories"
                            sx={{width: "96%", mb: 2}}
                            onKeyDown={(event) => {
                                handleCategoryInputChange(event);
                            }}
                        />
                        <Select
                            value=""
                            open={isCategorySelectOpen} // Control the open state of the Select
                            onClose={() => setIsCategorySelectOpen(false)}
                            onOpen={() => setIsCategorySelectOpen(true)}
                            onChange={(e) => handleCategorySelect(e)}
                            sx={{width: "4%", mb: 2}}
                            displayEmpty
                        >
                            {category.map((cat) => (
                                <MenuItem value={cat._id}>
                                    {cat.domain}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                ) : (
                    <Typography>No categories found.</Typography>
                )}
                <Typography sx={{marginBottom: '1rem'}}>Choose Location</Typography>
                {Array.isArray(location) && location.length > 0 ? (
                    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                        <TextField
                            type="text"
                            value={locationInputValue}
                            onChange={handleLocationInputChange}
                            placeholder="Type to filter locations"
                            sx={{width: "96%", mb: 2}}
                            onKeyDown={(event) => {
                                handleLocationInputChange(event);
                            }}
                        />
                        <Select
                            value=""
                            open={isLocationSelectOpen} // Control the open state of the Select
                            onClose={() => setIsLocationSelectOpen(false)}
                            onOpen={() => setIsLocationSelectOpen(true)}
                            onChange={(e) => handleLocationSelect(e)}
                            sx={{width: "4%", mb: 2}}
                            displayEmpty
                        >
                            {location.map((loc) => (
                                <MenuItem value={loc._id}>
                                    {loc.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                ) : (
                    <Typography>No locations found.</Typography>
                )}
                <Typography sx={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                    Do you want your post as Hidden?
                    <Tooltip title={<Typography style={{fontSize: '0.8rem'}}>Enabling the hidden post selection feature
                        ensures that only individuals who have applied for your idea can access and view its
                        description, keeping it hidden from others.</Typography>}>
                        <HelpIcon style={{fontSize: '1.1rem', marginLeft: '0.5rem'}}/>
                    </Tooltip>
                </Typography>
                <Select
                    value={selectedIsHidden}
                    onChange={(e) => handleIsHiddenChange(e.target.value)}
                    sx={{width: "100%", mb: 2}}
                >
                    <MenuItem value="true">
                        Yes
                        <Badge badgeContent={4} color="warning" style={{transform: 'scale(0.8)'}}>
                            <Paid sx={{fontSize: "25px"}}/>
                        </Badge>
                    </MenuItem>
                    <MenuItem value="false">No</MenuItem>
                </Select>
                <Typography sx={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                    Prepaid Applicant Number
                    <Tooltip
                        title={<Typography style={{fontSize: '0.8rem'}}>This represents the maximum number of applicants
                            who can apply for your idea without spending mergecoins. The idea owner covers application
                            fees for these applicants.</Typography>}>
                        <HelpIcon style={{fontSize: '1.1rem', marginLeft: '0.5rem'}}/>
                    </Tooltip>
                </Typography>
                <FlexBetween gap="0.5rem" alignItems="center">
                    <TextField
                        value={applicantNumber}
                        onChange={(e) => handleApplicantNumberChange(e.target.value)}
                        sx={{width: "100%", mb: 2}}
                    />
                    <Badge badgeContent={1} color="warning">
                        <Paid sx={{fontSize: "25px", mb: 2}}/>
                    </Badge>
                </FlexBetween>
                <Typography sx={{marginBottom: '1rem'}}>Title</Typography>
                <TextField
                    placeholder="Type catching attention title here..."
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        handleInputChange(); // Call handleInputChange when the input value changes
                    }}
                    sx={{width: "100%", mb: 2}}
                />
                <Typography sx={{marginBottom: '1rem'}}>Description</Typography>
                <TextField
                    placeholder="Describe your idea here..."
                    value={description}
                    onChange={(e) => {
                        setSubmission(e.target.value);
                        handleInputChange(); // Call handleInputChange when the input value changes
                    }}
                    multiline
                    rows={10}
                    sx={{width: "100%", mb: 2}}
                />
                <Box gridColumn="span 4" border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" p="1rem">
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({getRootProps, getInputProps}) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{"&:hover": {cursor: "pointer"}}}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? <p>Add Image Here</p> : (
                                        <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined/>
                                        </FlexBetween>
                                    )}
                                </Box>
                                <IconButton onClick={() => setImage(null)} sx={{width: "15%"}}>
                                    <DeleteOutlined/>
                                </IconButton>
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
                {formError && (
                    <Typography color="error" sx={{m: "1rem 0"}}>
                        {formError}
                    </Typography>
                )}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button
                        disabled={!description || !title || !category || !location || !selectedIsHidden}
                        onClick={handlePost}
                        variant="contained"
                        sx={{
                            borderRadius: "3rem",
                            mt: "1rem",
                            display: 'flex',
                            gap: '5px'
                        }}
                    >
                        post
                        <Badge badgeContent={submissionPrice} color="warning" max={9999}>
                            <Paid sx={{fontSize: "25px"}}/>
                        </Badge>
                    </Button>
                    {isFormDataPresent && (
                        <Button
                            onClick={handleClearForm}
                            variant="outlined"
                            sx={{
                                borderRadius: "3rem",
                                mt: "1rem",
                                display: 'flex',
                                gap: '5px'
                            }}
                        >
                            Clear Form
                        </Button>
                    )}
                    <Button
                        onClick={handleSaveDraft}
                        variant="outlined"
                        sx={{
                            borderRadius: "3rem",
                            mt: "1rem",
                            display: 'flex',
                            gap: '5px'
                        }}
                    >
                        Save as Draft
                    </Button>
                </div>
                {isDraftSaved && (
                    <Typography color="success" sx={{mt: "1rem"}}>
                        Draft saved successfully.
                    </Typography>
                )}
            </Box>
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>{errorDialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </WidgetWrapper>
    );
};

export default MergeSubmissionWidget;