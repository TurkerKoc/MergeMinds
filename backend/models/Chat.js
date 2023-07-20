import mongoose from "mongoose"; // for database

const chatSchema = new mongoose.Schema(
    {members: Array,},
    {timestamps: true}
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;