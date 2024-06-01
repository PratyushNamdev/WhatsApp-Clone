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
const setupSocket = require("./socket")
const port = process.env.PORT || 5000;
main().catch(console.dir);
app.use(express.json({limit:"10mb"}));
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Whatsapp clone api is working succesfully",
  });
});
app.use("/api/authentication", require("./Routes/Authentication_Routes"));
app.use("/api/chat", require("./Routes/Chat_Routes"));
app.use("/api/message", require("./Routes/Message_Routes"));
app.use("/api/chat", require("./Routes/GroupChat_Routes"));
app.use("/api/user" , require("./Routes/User_Routes"));
setupSocket(io)
server.listen(port, () => {
  console.log("server listening on port http://localhost:" + port);
});
