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

import WidgetWrapper from "components/WidgetWrapper";
import { io } from "socket.io-client";
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from "react-router-dom"; // useNavigate used for navigation between pages

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.disableAutoFetch = true;
pdfjs.GlobalWorkerOptions.disableStream = true;

const ChatWidget = () => {
    const { palette } = useTheme();
    const { userId } = useParams();
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [isContactsFetched, setIsContactsFetched] = useState(false);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [currentChatId, setCurrentChatId] = useState("");
    const [chatHistory, setChatHistory] = useState({ contact: null, messages: [] });
    const [showContacts, setShowContacts] = useState(true);
    const [socket, setSocket] = useState(null);
    const chatBoxRef = useRef(null);
    const navigate = useNavigate();

    const getChats = async () => {
        try {
            const response = await fetch(`http://localhost:3001/mergeChat/${userId}`, {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                const memberIds = data.reduce((ids, chat) => {
                    const memberId = chat.members.find((memberId) => memberId !== userId);
                    if (memberId && !ids.includes(memberId.toString())) {
                        ids.push(memberId.toString());
                    }
                    return ids;
                }, []);
                setContacts(memberIds);
            } else {
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
        setCurrentChatId("");
        setChatHistory({ contact, messages: [] });
        await fetchChatHistory(contact);
        setShowContacts(false);
        setSocket(io("http://localhost:3001")); // Replace with your server URL
    };

    const handleBackClick = () => {
        setShowContacts(true);
        socket.emit("shutdown");
    };

    const handleSendMessage = async () => {
        console.log("here");
        try {
            console.log(chatHistory);
            const response = await fetch("http://localhost:3001/mergeMessages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: userId,
                    text: message,
                    senderName: user.name,
                    senderSurname: user.surname,
                    chatId: currentChatId,
                }),
            });


            if (response.ok) {
                const sentMessage = await response.json();
                console.log("Sending message:", message);
                socket.emit("msg", { message: sentMessage, currentChatId: currentChatId });
                setChatHistory((prevChatHistory) => ({
                    ...prevChatHistory,
                    messages: [...prevChatHistory.messages, sentMessage],
                }));
                setMessage("");
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
    }, [contacts, isContactsFetched]);

    useEffect(() => {
        // Scroll the chat box to the bottom when chatHistory.messages change
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatHistory.messages]);
    return (
        <WidgetWrapper>
            <Box p={2} color={palette.text.primary} height="750px">
                {showContacts ? (
                    <React.Fragment>
                        <Box display="flex" alignItems="center" gap="1rem">
                            <Typography style={{ fontSize: "24px" }} variant="h6">
                                {title}
                            </Typography>
                        </Box>
                        <Box my={2}>
                            {contacts.map((contact, index) => {
                                if (contact) {
                                    return (
                                        <Box
                                            key={contact._id}
                                            display="flex"
                                            alignItems="center"
                                            gap="1rem"
                                            py={1}
                                            component={Link}
                                            to={`/profile/${contact._id}`}
                                            onClick={() => handleContactClick(contact)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Avatar
                                                src={`http://localhost:3001/assets/${contact.picturePath}`}
                                                alt={contact.name}
                                            />
                                            <Typography style={{ fontSize: "24px" }} variant="h6">
                                                {`${contact.name} ${contact.surname}`}
                                            </Typography>
                                        </Box>
                                    );
                                }
                                return null;
                            })}
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Button onClick={handleBackClick} variant="contained" color="primary">
                            Back
                        </Button>
                        {chatHistory.contact && (
                            <React.Fragment>
                                <Box maxHeight="550px" overflow="auto" my={2} ref={chatBoxRef}>
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
                                                        }}
                                                    >
                                                        "Click this message to open the document."
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
                                                    borderRadius={16}
                                                >
                                                    <Typography
                                                        style={{
                                                            color: message.senderId === userId ? "black" : "black",
                                                            textAlign: message.senderId === userId ? "right" : "left",
                                                        }}
                                                    >
                                                        {message.text}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        style={{
                                                            color: message.senderId === userId ? "black" : "black",
                                                            textAlign: message.senderId === userId ? "right" : "left",
                                                        }}
                                                    >
                                                        {new Date(message.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    variant="outlined"
                                    label="Message"
                                    fullWidth
                                    style={{ marginBottom: "8px" }}
                                />
                                <Button onClick={handleSendMessage} variant="contained" color="primary">
                                    Send
                                </Button>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </Box>
        </WidgetWrapper>
    );
};

export default ChatWidget;

