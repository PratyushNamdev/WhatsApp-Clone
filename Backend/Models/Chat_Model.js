const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupDP: {
      type: {
        public_id: { type: String, default: "" },
        url: {
          type: String,
          default: "https://res.cloudinary.com/dgxvtemh2/image/upload/v1708440483/whatsappClone/Default_Profile_ahjjqd.png",
        }
      },

      
    }
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;