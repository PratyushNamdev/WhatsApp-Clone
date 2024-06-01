const Message = require("../Models/Message_Model");
const Chat = require("../Models/Chat_Model");
const User = require("../Models/User_Model");
const mongoose = require("mongoose");
const fetchMessages = async (req, res) => {
  // try {
  //   let totalMessages;
  //   let page = 1;
  //   if (parseInt(req.query.page) > 0) {
  //     page = parseInt(req.query.page);
  //   }
  //   const userId = req.user.id;
  //   console.log(userId);
  //   const { chatId } = req.params;
  //   console.log(chatId);
  //   if (!chatId || !userId) {
  //     return res.json({ error: true, message: "Invalid request" });
  //   }

  //   const messages = await Message.find({ chatId: chatId })
  //     .populate("sender", "name , profilePic , email")
  //     .populate("chatId")
  //     .skip((page-1)*10)
  //     .limit(10)
  //     .sort({createdAt:-1});
  //     totalMessages = await Message.countDocuments({ chatId: chatId });
  //   res.json({messages ,  totalMessages});
  // } catch (error) {
  //   console.log(error);
  //   res.json({ error: true, message: "Internal Server Error" });
  // }

  try {
    const userId = req.user.id;
    console.log(userId);
    const { chatId } = req.params;
    console.log(chatId);
    if (!chatId || !userId) {
      return res.json({ error: true, message: "Invalid request" });
    }

    const messages = await Message.find({ chatId: chatId })
      .populate("sender", "userName , profilePic , email")
      .populate("chatId")
      .populate({
        path: "recipients.user", // Navigate to the 'user' field inside each recipient object
        select: "userName", // Select the 'userName' field
      })
      .sort({ createdAt: -1 });
    let totalMessages = await Message.countDocuments({ chatId: chatId });
    res.json({ messages, totalMessages });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Internal Server Error" });
  }
};
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, content, recipientIds } = req.body;

    if (!chatId || !content) {
      return res.json({ error: true, message: "Invalid request" });
    }
    let message = await Message.create({
      sender: userId,
      content: content,
      chatId: chatId,
      recipients: recipientIds.map((userId) => ({
        user: userId,
        status: "sent",
      })),
    });
    message = await message.populate("sender", "userName profilePic");
    message = await message.populate("chatId");
    message = await message.populate({
      path: "recipients.user", // Navigate to the 'user' field inside each recipient object
      select: "userName", // Select the 'userName' field
    });
    message = await User.populate(message, {
      path: "chatId.users",
      select: "userName profilePic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message })
      .populate("latestMessage")
      .exec();
    let updatedChat = await Chat.findById(chatId)
      .populate("latestMessage")
      .populate("users");
    updatedChat = await updatedChat.populate({
      path: "latestMessage.recipients.user",
      select: "userName",
    })
    res.json({ message, updatedChat });
  } catch (error) {
    console.error("Error sending message:", error);
    res.json({ error: true, message: "Internal server error" });
  }
};

const messageSeen = async (req, res) => {
  try {
    console.log("hree");
    const userId = req.user.id;
    const messages = req.body.messages; // Assuming an array of messages is sent in the request body
    let seenMessages = [];
    // Loop through each message and update readBy with the userId
    for (const message of messages) {
      // Assuming you're using Mongoose to interact with MongoDB

      let updatedMessage = await Message.findOneAndUpdate(
        { _id: message._id, "recipients.user": userId },
        { $set: { "recipients.$.status": "seen" } },
        { new: true } // This option ensures that the updated document is returned
      );

      updatedMessage = await updatedMessage.populate("chatId");
      updatedMessage = await updatedMessage.populate("sender", "userName _id");
      updatedMessage = await User.populate(updatedMessage, {
        path: "chatId.users",
        select: "userName _id",
      });
      updatedMessage = await updatedMessage.populate({
        path: "recipients.user", // Navigate to the 'user' field inside each recipient object
        select: "userName", // Select the 'userName' field
      });
      seenMessages.push(updatedMessage);
    }

    res.json({
      seenMessages,
      success: true,
      message: "Messages marked as seen successfully",
    });
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = { sendMessage, fetchMessages, messageSeen };
