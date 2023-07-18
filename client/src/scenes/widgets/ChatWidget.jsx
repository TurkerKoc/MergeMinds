import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Avatar,
    useTheme,
    Link,
    TextField,
    Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";

import WidgetWrapper from "components/WidgetWrapper";
import { io } from "socket.io-client";
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from "react-router-dom"; // useNavigate used for navigation between pages
import { useDropzone } from "react-dropzone";
import DialogContent from "@mui/material/DialogContent";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.disableAutoFetch = true;
pdfjs.GlobalWorkerOptions.disableStream = true;

const ChatWidget = () => {
    const { palette } = useTheme();
    const userId = useSelector((state) => state.user._id);
    const { postUserId } = useParams();
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [curContact, setCurContact] = useState(null);
    const [isContactsFetched, setIsContactsFetched] = useState(false);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [currentChatId, setCurrentChatId] = useState("");
    const [chatHistory, setChatHistory] = useState({ contact: null, messages: [] });
    const [showContacts, setShowContacts] = useState(true);
    const [socket, setSocket] = useState(null);
    const chatBoxRef = useRef(null);
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    

    const handleFileSelect = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const fileType = file.type;
        const validFileType = fileType === "application/pdf";

        if (validFileType) {
            setSelectedFile(file);
            setFileError(null);
        } else {
            // Show an error message to the user
            setFileError("Please select a PDF file");
        }
    };

    const handleDeleteUploadedFile = () => {
        setSelectedFile(null);
        setFileError(null);
        setMessage("");
    };

    // Configuration for TextField
    const textFieldDropzone = useDropzone({
        accept: ".pdf",
        multiple: false,
        onDrop: handleFileSelect,
        noClick: true,
    });

    // Configuration for Button
    const buttonDropzone = useDropzone({
        accept: ".pdf",
        multiple: false,
        onDrop: handleFileSelect,
        noClick: false,
    });

    const getChats = async () => {
        try {
            const response = await fetch(`http://localhost:3001/mergeChat/${userId}`, {
                method: "GET",
            });

            if (response.ok && !postUserId) {
                const data = await response.json();
                const memberIds = data.reduce((ids, chat) => {
                    const memberId = chat.members.find((memberId) => memberId !== userId);
                    if (memberId && !ids.includes(memberId.toString())) {
                        ids.push(memberId.toString());
                    }
                    return ids;
                }, []);
                setContacts(memberIds);
            } 
            else if (response.ok) {
                setContacts([postUserId]);
            }
            else {
                console.error("Error fetching user data:", response.status);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchChatHistory = async (contact) => {
        try {
            const response = await fetch(
                `http://localhost:3001/mergeChat/${userId}/${contact._id}`,
                {
                    method: "GET",
                }
            );

            if (response.ok) {
                const chatData = await response.json();
                const chatId = chatData._id;

                const messagesResponse = await fetch(
                    `http://localhost:3001/mergeMessages/${chatId}`,
                    {
                        method: "GET",
                    }
                );

                if (messagesResponse.ok) {
                    const chatMessages = await messagesResponse.json();
                    setCurrentChatId(chatId);
                    setChatHistory({ contact, messages: chatMessages });
                } else {
                    console.error("Error fetching chat messages:", messagesResponse.status);
                }
            } else {
                console.error("Error fetching chat history:", response.status);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const handleContactClick = async (contact) => {
        setCurContact(contact);
        setCurrentChatId("");
        setChatHistory({ contact, messages: [] });
        if (socket) {
          socket.disconnect(); // Disconnect the existing socket connection
        }
        const newSocket = io("http://localhost:3001"); // Create a new socket connection
        setSocket(newSocket);
        await fetchChatHistory(contact);
        setShowContacts(false);
    };

    const handleBackClick = () => {
        if(postUserId) {
            navigate(`/newsfeed`);
        }
        setCurContact(null);
        setShowContacts(true);
        socket.emit("shutdown");
    };

    const handleSendMessage = async () => {
        try {
            setFileError(null);
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("senderName", user.name);
            formData.append("senderSurname", user.surname);
            formData.append("chatId", currentChatId);
            console.log(selectedFile);
            if (selectedFile) {
                formData.append("file", selectedFile);
                formData.append("text", "http://localhost:3001/assets/" + selectedFile.name);
            } else {
                formData.append("text", message);
            }

            const response = await fetch("http://localhost:3001/mergeMessages", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const sentMessage = await response.json();
                socket.emit("msg", { message: sentMessage, currentChatId: currentChatId });
                setChatHistory((prevChatHistory) => ({
                    ...prevChatHistory,
                    messages: [...prevChatHistory.messages, sentMessage],
                }));
                setMessage("");
                setSelectedFile(null);
            } else {
                console.error("Error sending message:", response.status);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`http://localhost:3001/mergeUsers/${userId}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error("Error fetching user data:", response.status);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        getUser();
        getChats();
    }, [userId, token]);


    useEffect(() => {
        if (socket) {
            // ...

            // Listen for new messages
            socket.on("msg", (message, receivedChatId) => {
                console.log("Received message:", message);
                console.log(message.receivedChatId, currentChatId)
                if (message.receivedChatId === currentChatId) {
                    console.log(message.message);
                    setChatHistory((prevChatHistory) => ({
                        ...prevChatHistory,
                        messages: [...prevChatHistory.messages, message.message],
                    }));
                }
            });

            // ...

            return () => {
                // Clean up the socket connection when component unmounts
                socket.disconnect();
            };
        }
    }, [currentChatId]);

    //If you want to fetch chat history periodically, you can use the following code:

    // useEffect(() => {
    //     // Fetch chat history initially
    //     if (curContact) {
    //         fetchChatHistory(curContact);
    //     }
    //
    //     // Fetch chat history every 5 seconds
    //     const interval = setInterval(() => {
    //         if (curContact) {
    //             fetchChatHistory(curContact);
    //         }
    //     }, 1000);
    //
    //     // Clean up interval when component unmounts or curContact changes
    //     return () => clearInterval(interval);
    // }, [curContact]);

    const title = "Direct Messages";

    const fetchContactData = async (contact) => {
        try {
            const contactId = typeof contact === "object" ? contact._id : contact;
            const response = await fetch(`http://localhost:3001/mergeUsers/${contactId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const contactData = await response.json();
                return contactData;
            } else {
                console.error("Error fetching contact data:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Error fetching contact data:", error);
            return null;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    useEffect(() => {
        const fetchContacts = async () => {
            if (contacts.length > 0) {
                const contactsData = await Promise.all(
                    contacts.map((contact) => fetchContactData(contact))
                );
                setContacts(contactsData.filter((contactData) => contactData !== null));
                setIsContactsFetched(true);
            }
        };

        if (!isContactsFetched) {
            fetchContacts();
        }

        if (postUserId) {
            contacts.map((contact, index) => {
                handleContactClick(contact);
            })
        }
    }, [contacts, isContactsFetched]);

    useEffect(() => {
        // Scroll the chat box to the bottom when chatHistory.messages change
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatHistory.messages]);
    return (
        <WidgetWrapper>
            <Box p={2} color={palette.text.primary} maxHeight="750px">
                {(showContacts && !postUserId) ? (
                    <React.Fragment>
                        <Box display="flex" alignItems="center" gap="1rem">
                            <Typography style={{ fontSize: "24px" }} variant="h6">
                                {title}
                            </Typography>
                        </Box>
                        <Box my={2}>
                        <DialogContent dividers style={{ minWidth: '600px', minHeight: contacts.length > 0 ? '1px' : '50px' }}>
                        <div style={{ maxHeight: '400px', overflow: 'auto' , paddingRight: '20px' }}>
                            {contacts.map((contact, index) => {
                                if (contact) {
                                return (
                                    <Typography key={contact._id} variant="h6" style={{ marginBottom: '0.1rem' }}>
                                    <Button
                                        display="flex"
                                        alignItems="center"
                                        gap="1rem"
                                        py={1}
                                        component={Link}
                                        to={`/profile/${contact._id}`}
                                        onClick={() => handleContactClick(contact)}                                    
                                        style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '0.6rem',
                                        cursor: 'pointer',
                                        padding: '1rem',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '20px',
                                        width: '100%',
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        }}
                                    >
                                        <Avatar
                                        src={`http://localhost:3001/assets/${contact.picturePath}`}
                                        alt={contact.name}
                                        />
                                        <Typography style={{ fontSize: "16px" }} variant="h6">
                                        {`${contact.name} ${contact.surname}`}
                                        </Typography>
                                    </Button>
                                    </Typography>
                                );
                                }
                                return null;
                            })}
                            {!contacts.length && (
                                <Typography variant="h6" style={{ marginBottom: '0.1rem', textAlign: 'center'}}>
                                    You have no direct messages
                                </Typography>
                            )}
                        </div>
                        </DialogContent>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <FlexBetween gap="0.5rem" alignItems="left">
                            <Button onClick={handleBackClick} variant="contained" color="primary">
                                Back
                            </Button>
                            <FlexBetween gap="0.25rem" sx={{ marginBottom: '1rem' }}>
                                {curContact && (
                                    <><Button
                                        onClick={() => navigate(`/mergeProfilePage/${curContact._id}`)}
                                    ><Typography style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                            {curContact.name}{" "}{curContact.surname}
                                        </Typography><Avatar
                                            src={`http://localhost:3001/assets/${curContact.picturePath}`}
                                            alt={`${curContact.name} ${curContact.surname}`}
                                            style={{ marginRight: "8px", marginLeft: "8px" }} /></Button></>
                                )}
                            </FlexBetween>
                        </FlexBetween>

                        {chatHistory.contact && (
                            <React.Fragment>
                                <Box maxHeight="535px" overflow="auto" my={2} ref={chatBoxRef}>
                                    {chatHistory.messages.map((message) => (
                                        <Box
                                            key={message._id}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent={
                                                message.senderId === userId ? "flex-end" : "flex-start"
                                            }
                                            mb={1}
                                        >
                                            {curContact && message.senderId !== userId && (
                                                <Avatar
                                                    src={`http://localhost:3001/assets/${curContact.picturePath}`}
                                                    alt={`${curContact.name} ${curContact.surname}`}
                                                    style={{ marginRight: "8px", width: "35px", height: "35px" }}
                                                />
                                            )}
                                            {message.text && message.text.startsWith('http://localhost:3001/') ? (
                                                <Box
                                                    p={1}
                                                    bgcolor={
                                                        message.senderId === userId ? "primary.main" : "neutral.medium"
                                                    }
                                                    borderRadius={3}
                                                    onClick={() => window.open(message.text, "_blank")}>
                                                    <Typography
                                                        style={{
                                                            color: message.senderId === userId ? "black" : "black",
                                                            textAlign: message.senderId === userId ? "right" : "left",
                                                            maxWidth: "400px",
                                                        }}
                                                    >
                                                        Click this message to open resume of the user.
                                                    </Typography>
                                                    <Document
                                                        file={message.text}
                                                    >
                                                        <Page
                                                            pageNumber={1}
                                                            width={300}
                                                            renderAnnotationLayer={false}
                                                            renderInteractiveForms={false}
                                                            renderTextLayer={false} // Disable text layer rendering
                                                            onLoadError={console.error} // Handle any potential load errors
                                                            onRenderError={console.error} // Handle any potential render errors
                                                        />
                                                    </Document>
                                                    <Typography
                                                        variant="caption"
                                                        style={{
                                                            color: message.senderId === userId ? "black" : "black",
                                                            textAlign: message.senderId === userId ? "right" : "left",
                                                            maxWidth: "400px",
                                                        }}
                                                    >
                                                        {new Date(message.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Box
                                                    p={1}
                                                    bgcolor={
                                                        message.senderId === userId ? "primary.main" : "neutral.medium"
                                                    }
                                                    borderRadius={5}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: message.senderId === userId ? "black" : "black",
                                                            textAlign: message.senderId === userId ? "left" : "left",
                                                            maxWidth: "400px",
                                                        }}
                                                    >
                                                        {message.text.split('\n').map((line, index) => (
                                                            <React.Fragment key={index}>
                                                                {line}
                                                                <br />
                                                            </React.Fragment>
                                                        ))}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        style={{
                                                            color: message.senderId === userId ? "black" : "black",
                                                            textAlign: message.senderId === userId ? "right" : "left",
                                                            maxWidth: "400px",
                                                        }}
                                                    >
                                                        {new Date(message.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {message.senderId === userId && (
                                                <Avatar
                                                    src={`http://localhost:3001/assets/${user.picturePath}`}
                                                    alt={`${user.name} ${user.surname}`}
                                                    style={{ marginLeft: "8px", marginRight: "8px", width: "35px", height: "35px" }}
                                                    ml="1rem"
                                                />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                                <div {...textFieldDropzone.getRootProps()}>
                                    <input {...textFieldDropzone.getInputProps()} />
                                    {textFieldDropzone.isDragActive ? (
                                        <TextField
                                            value={selectedFile ? selectedFile.name : ''}
                                            variant="outlined"
                                            label="Drop the file here..."
                                            fullWidth
                                            style={{ marginBottom: '8px' }}
                                        />
                                    ) : (
                                        <TextField
                                            value={selectedFile ? selectedFile.name : message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            variant="outlined"
                                            label="Message"
                                            fullWidth
                                            style={{ marginBottom: '8px' }}
                                        />
                                    )}
                                </div>
                                {fileError && (
                                    <Typography variant="caption" color="error" style={{ fontSize: '13px' }}>
                                        {fileError}
                                    </Typography>
                                )}
                                <Box display="flex" justifyContent="flex-end" sx={{ mb: '1rem' }}>
                                    <FlexBetween gap="0.5rem">
                                        {!selectedFile && (
                                            <div {...buttonDropzone.getRootProps()}>
                                                <input {...buttonDropzone.getInputProps()} />
                                                <Button component="span" variant="contained" color="primary">
                                                    Upload File
                                                </Button>
                                            </div>
                                        )}
                                        {selectedFile && (
                                            <Button component="span" variant="contained" color="primary" onClick={handleDeleteUploadedFile}>
                                                Cancel
                                            </Button>
                                        )}
                                        <Button onClick={handleSendMessage} variant="contained" color="primary">
                                            Send
                                        </Button>
                                    </FlexBetween>
                                </Box>

                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </Box>
        </WidgetWrapper>
    );
};

export default ChatWidget;

