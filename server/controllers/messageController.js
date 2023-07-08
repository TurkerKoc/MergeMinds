import messageModel from '../models/MessageModel.js';

export const createMessage = async (req, res) => {
    const {chatId, senderId, text} = req.body;

    try {
        const newMessage = new messageModel({
            chatId,
            senderId,
            text
        })
        const response = await newMessage.save();
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
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
