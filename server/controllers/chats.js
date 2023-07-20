import chatModel from "../models/Chat.js";

export const createChat = async (req, res) => {
    const { firstId, secondId, coverLetter, resumePath } = req.body;
    // console.log("firstId", firstId);
    // console.log("secondId", secondId);
    try{        
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        })
        // console.log("current chat", chat);
        if(chat){
            res.status(200).json(chat);
        }else{
            // console.log("creating new chat");
            const newChat = new chatModel({
                members: [firstId, secondId]
            })
            // console.log("new chat", newChat);
            const response = await newChat.save();
            res.status(200).json(response);
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }
        })
            .sort({ updatedAt: -1 }); // Sort by updatedAt in descending order (newer to older)

        res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const findChatById = async (req, res) => {
    const { firstId, secondId } = req.params;

    try{
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        })
        res.status(200).json(chat);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}