const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const server = require("http").createServer(app);
const main = require("./Config/ConnectToDB");
app.use(cors());
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Adjust this to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;
main().catch(console.dir);
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Whatsapp clone api is working succesfully",
  });
});
app.use("/api/authentication", require("./Routes/Authentication_Routes"));
app.use("/api/chat", require("./Routes/Chat_Routes"));
app.use("/api/message", require("./Routes/Message_Routes"));

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
        socket.in(user._id).emit("Seen Received", { userId, message });
      });
    });
  });
  socket.on("messageDelivered" ,({messageId , chatId , senderId})=>{
    socket.in(senderId).emit("messageDeliveredAcknowledged" , {messageId, chatId, senderId})

  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
server.listen(port, () => {
  console.log("server listening on port http://localhost:" + port);
});
