// difference between js and jsx: jsx contains react components
import { Box, useMediaQuery, Button, useTheme, Select, MenuItem } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import React, { useState } from 'react';
import Navbar from "scenes/navbar";
import MergeBlogWidget from "scenes/widgets/MergeBlogWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import LinksWidget from "scenes/widgets/LinksWidget";
import MergePostsWidget from "scenes/widgets/MergePostsWidget";
import { setPosts } from "state";
import { setUser } from "state";
import FlexBetween from "components/FlexBetween";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import { useEffect } from "react";
import { useScrollTrigger, Zoom, Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollTop from "components/ScrollTop";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Popup from "scenes/widgets/PaymentPopup";
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';

const NewsFeed = () => {
    const { palette } = useTheme();
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const [categories, setCategories] = useState("");
    const [locations, setLocations] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
    const [selectedLocationFilter, setSelectedLocationFilter] = useState("");
    const [selectedButton, setSelectedButton] = useState('new');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showClearButton, setShowClearButton] = useState(false);
    const [postsToShow, setPostsToShow] = useState(10);
    const posts = useSelector((state) => state.posts);
    const [showLoadMore, setShowLoadMore] = useState(true);
    const [locationInputValue, setLocationInputValue] = useState("");
    const [isLocationSelectOpen, setIsLocationSelectOpen] = useState(false);
    const [categoryInputValue, setCategoryInputValue] = useState("");
    const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);

    localStorage.setItem("lastVisited", "newsfeed");

    let location = useLocation();
    let query = new URLSearchParams(location.search);
    const paymentStatus = query.get("payment");

    const [showPopup, setShowPopup] = useState(false);

    const getMergeUser = async () => {
        const response = await fetch(`http://localhost:3001/mergeUsers/${_id}`, {
            method: "GET",
        });
        const mergeUser = await response.json(); // we will get the logged in user from backend (backend will send the logged in user as json)
        if (response.ok) {
            dispatch(setUser({ user: mergeUser }));
        }
    };
    const handleLocationInputChange = (event) => {
        setLocationInputValue(event.target.value);
        if (event.target.value.length > 1) {
            getAllLocations(event.target.value);
        }
        if (event.key === "Enter") {
            setIsLocationSelectOpen(true);
        }
    };
    const handleCategoryInputChange = (event) => {
        setCategoryInputValue(event.target.value);
        if (event.target.value.length > 1) {
            getAllCategories(event.target.value);
        }
        if (event.key === "Enter") {
            setIsCategorySelectOpen(true);
        }
    };

    const handleTopClick = async () => {
        setSelectedButton('top');
        const sorted = [...posts].sort((a, b) => {
            const likesA = Object.keys(a.likes || {}).length;
            const likesB = Object.keys(b.likes || {}).length;
            return likesB - likesA;
        });
        console.log(sorted);
        console.log(posts);

        let result = randomizeSponsoredContent(sorted);
        dispatch(setPosts({ posts: result }));
        setPostsToShow(10);
    };

    function randomizeSponsoredContent(sorted) {
        console.log("sorted");
        console.log(sorted);
        const nonAdminPosts = sorted.filter(post => post.userId.username !== 'admin');
        const adminPosts = sorted.filter(post => post.userId.username === 'admin');
        const nonAdminCount = nonAdminPosts.length;
        const adminCount = adminPosts.length;

        let result = [];
        let adminIndex = 0;
        let mod = nonAdminCount > 10 ? 10 : nonAdminCount - 1;
        for (let i = 0; i < nonAdminCount; i++) {
            if (i % mod === 0 && adminIndex < adminCount && i !== 0) {
                const randomIndex = getRandomIndex(i - mod, i, result);
                // console.log(randomIndex);
                // console.log(result);
                result.splice(randomIndex, 0, adminPosts[adminIndex]);
                adminIndex++;
            } else if (i === nonAdminCount - 1 && adminIndex < adminCount) {
                const randomIndex = getRandomIndex(i - (i % mod), i, result);
                // console.log(randomIndex);
                // console.log(result);
                result.splice(randomIndex, 0, adminPosts[adminIndex]);
                adminIndex++;
            }
            result.push(nonAdminPosts[i]);
        }
        console.log(result);
        return result;
    }

    const handleNewClick = async () => {
        console.log('handleNewClick');
        setSelectedButton('new');
        const sorted = [...posts].sort((a, b) => {
            const createdAtA = new Date(a.createdAt);
            const createdAtB = new Date(b.createdAt);
            return createdAtB - createdAtA;
        });
        console.log('sorted', sorted);

        let result = randomizeSponsoredContent(sorted);
        dispatch(setPosts({ posts: result }));
        setPostsToShow(10);
    };

    const getRandomIndex = (min, max, result) => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * (max - min) + min);
        } while (result.includes(randomIndex));

        return randomIndex;
    };

    // console.log(randomIndex);


    const handleCategoryAutocompleteChange = async (e) => {
        const option = categories.find((cat) => cat._id === e.target.value);
        setSelectedCategoryFilter(option);
        setCategoryInputValue("");
        const response = await fetch("http://localhost:3001/mergePosts", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (option && option._id) {
            var filtered = data.filter((post) => {
                return post.userId?.username === "admin" || post.categoryId?._id === option._id;
            });
            console.log('filtered Category', filtered);
            if (selectedLocationFilter !== "") {
                filtered = filtered.filter((post) => {
                    return post.userId?.name === 'admin' || post.locationId?._id === selectedLocationFilter._id;
                });
                console.log('filtered Location', filtered);
            }
            let result = randomizeSponsoredContent(filtered);
            dispatch(setPosts({ posts: result }));
        }
        setPostsToShow(10);
    };
    const handleLocationAutocompleteChange = async (e) => {
        const option = locations.find((loc) => loc._id === e.target.value);
        setSelectedLocationFilter(option);
        setLocationInputValue("");
        const response = await fetch("http://localhost:3001/mergePosts", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (option && option._id) {
            var filtered = data.filter((post) => {
                return post.locationId?._id === option._id || post.userId?.username === 'admin';
            });
            console.log('filtered Location', filtered);
            if (selectedCategoryFilter !== "") {
                filtered = filtered.filter((post) => {
                    return post.categoryId?._id === selectedCategoryFilter._id || post.userId?.username === 'admin';
                });
            }
            console.log('filtered category', filtered);
            let result = randomizeSponsoredContent(filtered);
            dispatch(setPosts({ posts: result }));
        }
        setPostsToShow(10);
    };


    // const getPosts = async () => {
    //   const response = await fetch("http://localhost:3001/mergePosts", {
    //     method: "GET",
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const data = await response.json();
    //   dispatch(setPosts({ posts: data }));
    // };
    const removeCategoryFilter = async (filter) => {
        setSelectedCategoryFilter("");
        const response = await fetch("http://localhost:3001/mergePosts", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (selectedLocationFilter !== "") {
            var filtered = data.filter((post) => {
                return post.locationId?._id === selectedLocationFilter._id;
            });
            console.log('filtered Location', filtered);
            dispatch(setPosts({ posts: filtered }));
        } else {
            dispatch(setPosts({ posts: data }));
        }
        setPostsToShow(10);
    };

    const removeLocationFilter = async (filter) => {
        setSelectedLocationFilter("");
        const response = await fetch("http://localhost:3001/mergePosts", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (selectedCategoryFilter !== "") {
            var filtered = data.filter((post) => {
                return post.categoryId?._id === selectedCategoryFilter._id;
            });
            console.log('filtered category', filtered);
            dispatch(setPosts({ posts: filtered }));
        } else {
            dispatch(setPosts({ posts: data }));
        }
        setPostsToShow(10);
    };


    const getAllCategories = async (value) => {
        const response = await fetch(`http://localhost:3001/mergePosts/categories?query=${value}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const categories = await response.json();
        //TO DO delete category with category.domain === 'admin'
        const filteredCategories = categories.filter(category => category.domain !== 'Admin');

        setCategories(filteredCategories);
    }
    const getAllLocations = async (value) => {
        const response = await fetch(`http://localhost:3001/mergePosts/locations?query=${value}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        const locations = await response.json();
        const filteredLocations = locations.filter(location => location.name !== 'Admin');

        setLocations(filteredLocations);
    }

    const handleSearch = () => {
        const lowercaseSearchKeyword = searchKeyword.toLowerCase();
        if (lowercaseSearchKeyword !== '') {
            const filteredPosts = posts.filter((post) =>
                post.description.toLowerCase().includes(lowercaseSearchKeyword) ||
                post.title.toLowerCase().includes(lowercaseSearchKeyword)
            );
            dispatch(setPosts({ posts: filteredPosts }));
            setShowClearButton(true);
        } else {
            dispatch(setPosts({ posts }));
            setShowClearButton(false);
        }
    };


    const handleClearSearch = () => {
        setSearchKeyword('');
        setSelectedCategoryFilter('');
        setSelectedLocationFilter('');
        dispatch(setPosts({ posts: [] })); // Clear the posts temporarily
        setShowClearButton(false);

        // Fetch all posts again from the server and update the posts state
        const fetchPosts = async () => {
            const response = await fetch("http://localhost:3001/mergePosts", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            dispatch(setPosts({ posts: data }));
        };

        fetchPosts(); // Call the fetchPosts function to get all posts again
    };


    useEffect(() => {
        if (paymentStatus === 'success') {
            setShowPopup(true);
        }
    }, [paymentStatus]);

    useEffect(() => {
        getAllCategories("");
        getAllLocations("ab");
        getMergeUser();
    }, []);

    useEffect(() => {
        if (postsToShow >= posts.length) {
            setShowLoadMore(false);
        } else {
            setShowLoadMore(true);
        }
    }, [postsToShow, posts]);
    useEffect(() => {
        if (categoryInputValue === "") {
            getAllCategories("");
        }
    }, [categoryInputValue]);
    useEffect(() => {
        if (locationInputValue === "") {
            getAllLocations("ab");
        }
    }, [locationInputValue]);

    return (
        <Box>
            <Navbar /> {/* Navbar is a component we created in mern-social-media/client/src/scenes/navbar/index.jsx */}
            <Popup open={showPopup} handleClose={() => setShowPopup(false)} />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop="2rem"
                gap="2rem"
            >
                <Box flexBasis={isNonMobileScreens ? "26.7%" : undefined} paddingLeft="2rem"
                    paddingRight="2rem"> {/* flexBasis is a css property to set width of an element and 26% means 26% of parent element (%26 of page) */}
                    <LinksWidget />
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "66%" : undefined}
                >
                    <FlexBetween gap="0.5rem" sx={{ marginBottom: '1rem' }}>
                        <Grid container alignItems="center" style={{ height: "100%" }}>
                            <Grid item xs>
                                <TextField
                                    label="Search"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    sx={{ height: '100%', fontSize: '0.75rem', width: '100%', marginRight: '1rem' }}// Set width to 100%
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={handleSearch} sx={{ height: '50px', fontSize: '0.75rem', ml: '1rem' }}>
                                    <SearchIcon sx={{ fontSize: '2rem' }} />
                                </Button>
                            </Grid>
                        </Grid>

                        {showClearButton && (
                            <Button
                                variant="outlined"
                                onClick={handleClearSearch}
                                sx={{
                                    width: "100%", // Adjust the width to make it smaller
                                    height: "100%", // Adjust the height to make it smaller
                                    fontSize: '0.75rem',
                                }}
                            >
                                <CloseIcon sx={{ fontSize: "14px", marginRight: "2px" }} /> {/* Adjust the font size */}
                            </Button>
                        )}
                    </FlexBetween>
                    <FlexBetween gap="1rem" alignItems="flex-start">
                        <FlexBetween gap="0.5rem" alignItems="left">
                            <Button
                                // disabled={!post}
                                onClick={handleNewClick}
                                sx={{
                                    color: palette.background.alt,
                                    backgroundColor: selectedButton === 'new' ? palette.primary.main : palette.primary.light,
                                    borderRadius: "3rem",
                                    mb: "1rem",
                                }}
                            >
                                New
                            </Button>
                            <Button
                                // disabled={!post}
                                onClick={handleTopClick}
                                sx={{
                                    color: palette.background.alt,
                                    backgroundColor: selectedButton === 'top' ? palette.primary.main : palette.primary.light,
                                    borderRadius: "3rem",
                                    mb: "1rem",
                                }}
                            >
                                Top
                            </Button>
                        </FlexBetween>
                        <FlexBetween gap="0.25rem" sx={{ marginBottom: '1rem' }}>
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {(popupState) => (
                                    <div>
                                        <Button variant="contained" {...bindToggle(popupState)}>
                                            Category
                                        </Button>
                                        <Popper {...bindPopper(popupState)} transition>
                                            {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={350}>
                                                    <FlexBetween>
                                                        <TextField
                                                            type="text"
                                                            value={categoryInputValue}
                                                            onChange={handleCategoryInputChange}
                                                            placeholder="Type to filter categories"
                                                            sx={{ width: "85%", mb: 2 }}
                                                            onKeyDown={(event) => {
                                                                handleCategoryInputChange(event);
                                                            }}
                                                        />
                                                        <Select
                                                            value=""
                                                            open={isCategorySelectOpen} // Control the open state of the Select
                                                            onClose={() => setIsCategorySelectOpen(false)}
                                                            onOpen={() => setIsCategorySelectOpen(true)}
                                                            onChange={(e) => {
                                                                handleCategoryAutocompleteChange(e)
                                                                popupState.close();
                                                            }}
                                                            sx={{ width: "15%", mb: 2 }}
                                                            displayEmpty
                                                        >
                                                            {categories.map((cat) => (
                                                                <MenuItem value={cat._id}>
                                                                    {cat.domain}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {/* <Autocomplete
                                                            id="grouped-demo"
                                                            options={categories}
                                                            groupBy={(option) => option.domain.firstLetter}
                                                            onChange={(event, option) => {
                                                                handleCategoryAutocompleteChange(option);
                                                                popupState.close(); // Close the popup when an option is chosen
                                                            }}
                                                            getOptionLabel={(option) => option.domain}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params}
                                                                label="Category" />}
                                                        /> */}
                                                    </FlexBetween>
                                                </Fade>
                                            )}
                                        </Popper>
                                    </div>
                                )}
                            </PopupState>
                            <PopupState variant="popper" popupId="demo-popup-popper">
                                {(popupState) => (
                                    <div>
                                        <Button variant="contained" {...bindToggle(popupState)}>
                                            Location
                                        </Button>
                                        <Popper {...bindPopper(popupState)} transition>
                                            {({ TransitionProps }) => (
                                                <Fade {...TransitionProps} timeout={350}>
                                                    <FlexBetween>
                                                        <TextField
                                                            type="text"
                                                            value={locationInputValue}
                                                            onChange={handleLocationInputChange}
                                                            placeholder="Type to filter locations"
                                                            sx={{ width: "85%", mb: 2 }}
                                                            onKeyDown={(event) => {
                                                                handleLocationInputChange(event);
                                                            }}
                                                        />
                                                        <Select
                                                            value=""
                                                            open={isLocationSelectOpen} // Control the open state of the Select
                                                            onClose={() => setIsLocationSelectOpen(false)}
                                                            onOpen={() => setIsLocationSelectOpen(true)}
                                                            onChange={(e) => {
                                                                handleLocationAutocompleteChange(e);
                                                                popupState.close();
                                                            }}
                                                            sx={{ width: "15%", mb: 2 }}
                                                            displayEmpty
                                                        >
                                                            {locations.map((loc) => (
                                                                <MenuItem value={loc._id}>
                                                                    {loc.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {/* <Autocomplete
                                                            id="grouped-demo"
                                                            options={locations}
                                                            groupBy={(option) => option.name.firstLetter}
                                                            onChange={(event, option) => {
                                                                handleLocationAutocompleteChange(option)
                                                                popupState.close(); // Close the popup when an option is chosen
                                                            }}
                                                            getOptionLabel={(option) => option.name}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params}
                                                                label="Locations" />}
                                                        /> */}
                                                    </FlexBetween>
                                                </Fade>
                                            )}
                                        </Popper>
                                    </div>
                                )}
                            </PopupState>
                        </FlexBetween>
                    </FlexBetween>
                    <Box sx={{ alignItems: 'left', display: 'inline-flex' }}>
                        {selectedCategoryFilter && (
                            <Button
                                key={selectedCategoryFilter}
                                variant="outlined"
                                onClick={() => removeCategoryFilter(selectedCategoryFilter)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "16px",
                                    padding: "4px",
                                    mb: "1rem",
                                    mr: "0.5rem",
                                }}
                            >
                                <span style={{ marginRight: "4px" }}>{selectedCategoryFilter.domain}</span>
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: palette.primary.main,
                                        color: palette.primary.contrastText,
                                        cursor: "pointer",
                                    }}
                                >
                                    X
                                </span>
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ alignItems: 'left', display: 'inline-flex' }}>
                        {selectedLocationFilter && (
                            <Button
                                key={selectedLocationFilter}
                                variant="outlined"
                                onClick={() => removeLocationFilter(selectedLocationFilter)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "16px",
                                    padding: "4px",
                                    mb: "1rem",
                                    mr: "0.5rem",
                                }}
                            >
                                <span style={{ marginRight: "4px" }}>{selectedLocationFilter.name}</span>
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: palette.primary.main,
                                        color: palette.primary.contrastText,
                                        cursor: "pointer",
                                    }}
                                >
                                    X
                                </span>
                            </Button>
                        )}
                    </Box>
                    <MergePostsWidget userId={_id} postsToShow={postsToShow} />
                    <Box display="flex" justifyContent="center">
                        {showLoadMore && (
                            <Button onClick={() => setPostsToShow(postsToShow + 10)}>
                                Load More
                            </Button>
                        )}
                    </Box>
                </Box>
                <Box>
                    {/* ... */}
                    <Box id="back-to-top-anchor" /> {/* Add this anchor to the bottom of the page */}
                    {/* ... */}
                    <ScrollTop>
                        <Fab color="primary" size="small" aria-label="scroll back to top">
                            <KeyboardArrowUpIcon />
                        </Fab>
                    </ScrollTop>
                </Box>
                {isNonMobileScreens && (
                    <Box flexBasis="26%" mr="2rem">
                        <MergeBlogWidget />
                        <Box m="2rem 0" />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default NewsFeed;
