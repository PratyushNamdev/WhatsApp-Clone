const User = require("../Models/User_Model");
const Chat = require("../Models/Chat_Model");
const Message = require("../Models/Message_Model");
const cloudinary = require("../Services/Cloudinary")
const createGroupChat = async (req , res)=>{
   const {participants , groupName , groupDP} = req.body;
   console.log(participants)
   const adminId = req.user.id;
   participants.push(adminId)
   let newGroupDp = {};
   try{
   if(typeof groupDP === "string" && groupDP !== ""){
        const response = await cloudinary.uploader.upload(groupDP, {
            folder:"WhatsappCloneGroupDP"
        })
        console.log(response)
        newGroupDp.public_id = response.public_id;
        newGroupDp.url = response.secure_url;
   }
   const chat = await Chat.create({
    chatName: groupName,
    isGroupChat: true,
    users: participants,
    latestMessage: null,
    groupDP: newGroupDp,
    groupAdmin: adminId,
   });
 
   res.json({chat})
   }
   catch(e){
    console.log(e);
    res.json({error:true , message:"internal error"})
   }
}

module.exports = {createGroupChat}
