const express = require("express");
const router = express.Router();
const DecodingToken = require("../Middleware/DecodingToken");
const User_Controllers = require("../Controllers/User_Controllers");
router.get("/searchUser/:email" ,DecodingToken, User_Controllers.searchUser )
router.put("/updateProfile", DecodingToken , User_Controllers.updateProfile);
router.delete("/deleteProfilePicture" , DecodingToken , User_Controllers.deleteProfilePicture);
module.exports = router;