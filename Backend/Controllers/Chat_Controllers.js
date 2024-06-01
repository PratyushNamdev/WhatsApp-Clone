const User = require("../Models/User_Model");
const Chat = require("../Models/Chat_Model");
const Message = require("../Models/Message_Model");
const searchUser = async (req, res) => {

  try {
    const { email } = req.params;
  
    const loggedInUserId = req.user.id;

    const users = await User.find({
      $and: [
        {
          $or: [
            { name: { $regex: email, $options: "i" } },
            { email: { $regex: email, $options: "i" } },
          ],
        },
        { _id: { $ne: loggedInUserId } }, // Exclude the logged-in user's ID
      ],
    })
      .select("-password")
      .limit(7);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createChat = async (req, res) => {
  const { userId } = req.body;
  const initiatorId = req.user.id;
  console.log(initiatorId);

  try {
    if (!userId) {
      return res.json({ error: true, message: "No participant Id" });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: initiatorId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name profilePic email",
    });
    if (isChat.length > 0) {
      return res.json({ chat: isChat[0] });
    } else {
      const createdChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [initiatorId, userId],
        latestMessage: null,
      });
      const chat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.json({ chat });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: "Internal Server Error" });
  }
};

const fetchChats = async (req, res) => {
  const userId = req.user.id;

  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: userId } }
    })
      .populate({
        path: "users",
        select: "-password"
      })
      .populate({
        path: "latestMessage",
        populate: {
          path: "recipients.user",
          select: "userName"
        }
      })
      .exec();
     

      chats.sort((chat1, chat2) => {
        const createdAt1 = chat1.latestMessage ? chat1.latestMessage.createdAt : 0;
        const createdAt2 = chat2.latestMessage ? chat2.latestMessage.createdAt : 0;
        return createdAt2 - createdAt1; // Descending order
    });
  
      const chatsWithUnseenCount = await Promise.all(chats.map(async (chat) => {
        if (chat.latestMessage !== null) {
          const count = await Message.countDocuments({
              chatId: chat._id,
          sender: { $ne: userId }, // Exclude messages sent by the user
          recipients: { 
            $elemMatch: { 
              user: userId, 
              status: { $ne: 'seen' } 
            } 
          }
          });
          return { ...chat.toObject(), unseenMessageCount: count };
        } else {
          return chat.toObject();
        }
      }));
  
  

    res.json({ chats:chatsWithUnseenCount });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.json({ error: true, message: "Internal server error" });
  }
};


module.exports = { searchUser, createChat, fetchChats };
