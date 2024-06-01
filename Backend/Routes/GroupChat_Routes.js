const express = require("express");
const router = express.Router();
const DecodingToken = require("../Middleware/DecodingToken");
const { createGroupChat } = require("../Controllers/GroupChat_Controllers");

router.post("/createGroupChat" , DecodingToken , createGroupChat);
module.exports = router;