import messageModel from '../models/MessageModel.js';
import chatModel from '../models/Chat.js';

export const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    try {
        const newMessage = new messageModel({
            chatId,
            senderId,
            text
        });

        const response = await newMessage.save();

        await chatModel.findByIdAndUpdate(chatId, { updatedAt: new Date() });

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}


export const getMessages = async (req, res) => {
    const {chatId} = req.params;
    try {
        const messages = await messageModel.find({
            chatId
        })
        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getLastMessageTimestampForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] },
        });

        const chatIds = chats.map((chat) => chat._id);

        const lastMessages = await messageModel
            .find({
                chatId: { $in: chatIds },
                senderId: { $ne: userId }, // Exclude messages where the user is the sender
            })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest message first
            .limit(1); // Limit the number of messages to the number of chats

        const lastMessageTimestamps = lastMessages.map((message) => {
            // Convert the timestamp to the user's local time
            const localTimestamp = new Date(message.createdAt).toLocaleString();
            return { lastMessageTimestamp: localTimestamp };
        });

        res.status(200).json(lastMessageTimestamps);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};



