import mongoose from "mongoose"; // for database

const messageSchema =
    new mongoose.Schema({
            chatId: String,
            senderId: String,
            senderName: String,
            senderSurname: String,
            text: String
        },
        {timestamps: true}
    );

const Message = mongoose.model("Message", messageSchema);
export default Message;