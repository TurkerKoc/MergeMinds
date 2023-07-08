import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
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


const ChatWidget = () => {
    const {palette} = useTheme();
    const {userId} = useParams();
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [isContactsFetched, setIsContactsFetched] = useState(false);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [currentChatId, setCurrentChatId] = useState("");
    const [chatHistory, setChatHistory] = useState({contact: null, messages: []});
    const [showContacts, setShowContacts] = useState(true);
    const socket = io("http://localhost:3001"); // Replace with your server URL

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
                    setChatHistory({contact, messages: chatMessages});
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
        setChatHistory({contact, messages: []});
        await fetchChatHistory(contact);
        setShowContacts(false);
    };

    const handleBackClick = () => {
        setShowContacts(true);
        socket.emit("disconnect");

    };

    const handleSendMessage = async () => {
        try {
            socket.emit("chat message", { text: message, chatId: currentChatId });

            console.log(chatHistory);
            const response = await fetch("http://localhost:3001/mergeMessages", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
                    headers: {Authorization: `Bearer ${token}`},
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
        // ...

        // Listen for new messages
        socket.on("chat message", (message) => {
            if (message.chatId === currentChatId) {
                setChatHistory((prevChatHistory) => ({
                    ...prevChatHistory,
                    messages: [...prevChatHistory.messages, message],
                }));
            }
        });

        // ...

        return () => {
            // Clean up the socket connection when component unmounts
            socket.disconnect();
        };
    }, [currentChatId]);


    const title = "Direct Messages";

    const fetchContactData = async (contact) => {
        try {
            const contactId = typeof contact === "object" ? contact._id : contact;
            const response = await fetch(`http://localhost:3001/mergeUsers/${contactId}`, {
                method: "GET",
                headers: {Authorization: `Bearer ${token}`},
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

    return (
        <WidgetWrapper>
            <Box p={2} color={palette.text.primary}>
                {showContacts ? (
                    <React.Fragment>
                        <Box display="flex" alignItems="center" gap="1rem">
                            <Typography style={{fontSize: "24px"}} variant="h6">
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
                                            style={{cursor: "pointer"}}
                                        >
                                            <Avatar
                                                src={`http://localhost:3001/assets/${contact.picturePath}`}
                                                alt={contact.name}
                                            />
                                            <Typography style={{fontSize: "24px"}} variant="h6">
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
                                <Box maxHeight="300px" overflow="auto" my={2}>
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
                                            <Box
                                                p={1}
                                                bgcolor={
                                                    message.senderId === userId ? "primary.main" : "grey.200"
                                                }
                                                borderRadius={16}
                                            >
                                                <Typography
                                                    style={{
                                                        color: message.senderId === userId ? "white" : "inherit",
                                                        textAlign: message.senderId === userId ? "right" : "left",
                                                    }}
                                                >
                                                    {message.text}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    style={{
                                                        color: message.senderId === userId ? "white" : "inherit",
                                                        textAlign: message.senderId === userId ? "right" : "left",
                                                    }}
                                                >
                                                    {new Date(message.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    variant="outlined"
                                    label="Message"
                                    fullWidth
                                    style={{marginBottom: "8px"}}
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

