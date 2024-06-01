const mongoose = require("mongoose");

const recipientStatusSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent',
  }
}, { _id: false }); // No need for a separate _id for each recipient status

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    recipients: [recipientStatusSchema], // Array of recipient statuses
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
