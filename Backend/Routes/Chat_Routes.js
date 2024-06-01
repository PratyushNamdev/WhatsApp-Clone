const express = require("express");
const router = express.Router();
const Chat_Controllers = require("../Controllers/Chat_Controllers");
const DecodingToken = require("../Middleware/DecodingToken");
router.get("/searchUser/:email" ,DecodingToken, Chat_Controllers.searchUser )
router.post("/createChat" ,DecodingToken, Chat_Controllers.createChat)
router.get("/fetchChats", DecodingToken, Chat_Controllers.fetchChats);
module.exports = router;