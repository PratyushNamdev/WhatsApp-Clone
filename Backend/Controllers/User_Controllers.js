const User = require("../Models/User_Model");
const cloudinary = require("../Services/Cloudinary")
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
const updateProfile = async (req , res)=>{

    try{
    const userId = req.user.id;
    const updateData = req.body;

    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
           error:true,
            message: "User Not Found"
        })
    }
    
    if(updateData.userName){
        user.userName = updateData.userName;
    }
    if(updateData.about){
        user.about = updateData.about;
    }
    if(updateData.newProfilePic){
        if(typeof updateData.newProfilePic === "string" && updateData.newProfilePic !== ""){
            const response = await cloudinary.uploader.upload(updateData.newProfilePic, {
                folder:"WhatsappCloneProfilePic"
            })
            console.log(response)
            user.profilePic.public_id = response.public_id;
            user.profilePic.url = response.secure_url;
       }
    }
    await user.save();
    res.json({user , message:"Profile updated Successfully"})
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }

}
const deleteProfilePicture = async (req , res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);
        console.log(user)
        if(!user){
            return res.status(404).json({
                error:true,
                 message: "User Not Found"
             })
        }
        user.profilePic.public_id = "";
        user.profilePic.url = "https://res.cloudinary.com/dgxvtemh2/image/upload/v1708440483/whatsappClone/Default_Profile_ahjjqd.png";
        await user.save();
        res.json({user , message:"Profile updated Successfully"})
    }
    catch(e){
        console.log(err)
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }

}
module.exports = {searchUser , updateProfile , deleteProfilePicture};