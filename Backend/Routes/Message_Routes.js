const express = require("express");
const router = express.Router();
const DecodingToken = require("../Middleware/DecodingToken")
const Message_Controllers = require("../Controllers/Message_Controllers");
router.post("/sendMessage" , DecodingToken , Message_Controllers.sendMessage);
router.get("/fetchMessages/:chatId" ,DecodingToken , Message_Controllers.fetchMessages);
router.post("/messageSeen" , DecodingToken , Message_Controllers.messageSeen)
module.exports = router;