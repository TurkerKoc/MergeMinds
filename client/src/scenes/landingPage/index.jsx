import React, { useState, useEffect } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Import the CSS file

const LandingPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleDiscoverYourself = () => {
        navigate("/mergeLogin"); // Navigate to the LoginPage
    };

    const ideaCards = [
        "Let's open a coffee shop at Marienplatz!",
        "I need a co-founder for my startup!",
        "I want to learn how to code!",
        "I am developing a new mobile app and need a designer!",
        "Looking for a hiking partner!",
        "Want to start a book club!",
        "Searching for a language exchange partner!",
        "Seeking collaborators for a music project!",
        "Planning a road trip and need travel buddies!",
        "Starting a fitness challenge group!",
    ]; // Increased to 10 idea cards

    const [typingText, setTypingText] = useState("");
    const targetText =
        "MergeMinds is here to make your ideas come through. If you have an idea, let's make it real!"; // Replace with your desired text

    useEffect(() => {
        let currentText = "";
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex < targetText.length) {
                currentText += targetText[currentIndex];
                setTypingText(currentText);
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100); // Adjust typing speed as needed

        return () => {
            clearInterval(typingInterval);
        };
    }, []);

    return (
        <Box display="flex">
            <Box
                className="left-side" // Add a CSS class to the left side container
                width="50%" // Adjust the width as needed
                height="100vh" // Adjust the height as needed
                p="10rem 6%"
                textAlign="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Typography fontWeight="bold" fontSize="50px" color="text">
                    MergeMinds
                </Typography>

                <Box
                    mt="20px" // Add margin at the top
                    display="flex"
                    justifyContent="center"
                    flexWrap="wrap" // Allow the idea cards to wrap if needed
                >
                    {ideaCards.map((card, index) => (
                        <Box
                            key={index}
                            maxWidth="400px" // Limit the maximum width of the card
                            maxHeight="200px" // Limit the maximum height of the card
                            width="auto" // Allow the card to adjust its width based on content
                            backgroundColor="AntiqueWhite" // Set the background color for each idea card
                            p="20px" // Adjust the padding as needed
                            borderRadius="4px" // Add border radius for a nicer appearance
                            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)" // Add a subtle shadow
                            style={{
                                margin: "10px", // Add margin to separate the idea cards
                                animation: "breathing 3s ease-in-out infinite", // Add continuous breathing animation
                            }}
                        >
                            <div className="card-content">{card}</div>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box
                width="50%" // Adjust the width as needed
                height="100vh" // Adjust the height as needed
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                position="relative"
                flexDirection="column" // Add flexDirection to align items vertically
            >
                <div className="horizontal-line"></div>
                <div className="vertical-line"></div>
                <div className="logo-container dissolve"> {/* Added dissolve animation */}
                    <img
                        src="http://localhost:3001/assets/mmlogo-white-cc.png"
                        alt="MergeMinds Logo"
                        className="logo"
                    />
                </div>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    marginTop="3rem" // Updated marginTop
                >
                    <Typography variant="h5">{typingText}</Typography>
                    <Box textAlign="center" marginTop="30em"> {/* Adjusted marginTop */}
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleDiscoverYourself}
                        >
                            Start Your Journey!
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LandingPage;
