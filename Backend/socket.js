const Message = require("./Models/Message_Model");
const setupSocket = (io)=>{
    io.on("connection", (socket) => {
        console.log("Connected to socket.io");
        socket.on("setup", (userData) => {
          socket.join(userData._id);
          socket.emit("connected");
        });
      
        socket.on("join chat", (room) => {
          socket.join(room);
          console.log("User Joined Room: " + room);
        });
      
        socket.on("new message", (newMessageRecieved) => {
          var chat = newMessageRecieved.message.chatId;
      
          if (!chat.users) return console.log("chat.users not defined");
      
          chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.message.sender._id) return;
      
            socket.in(user._id).emit("message recieved", newMessageRecieved);
          });
        });
        socket.on("messageSeen", ({ userId, messages }) => {
          messages.map((message) => {
            var chat = message.chatId;
      
            if (!chat.users) return console.log("chat.users not defined");
      
            chat.users.forEach((user) => {
              if (user._id !== message.sender._id) return;
              console.log("CALLED");
              socket.in(user._id).emit("Seen Received", {messageId:message._id ,chatId:message.chatId._id,senderId:message.sender._id , recipientId: userId });
            });
          });
        });
        socket.on("messageDelivered" , async ({messageId , chatId , senderId ,recipientId})=>{
          await Message.findOneAndUpdate(
            { _id: messageId, 'recipients.user': recipientId },
            { $set: { 'recipients.$.status': 'delivered' } },
            { new: true }
          );
          console.log("server")
          socket.in(senderId).emit("messageDeliveredAcknowledged" , {messageId, chatId, senderId, recipientId})
      
        });
      
        socket.off("setup", () => {
          console.log("USER DISCONNECTED");
          socket.leave(userData._id);
        });
      });
}
module.exports = setupSocket;