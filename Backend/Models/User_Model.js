const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,

        default: "https://res.cloudinary.com/dgxvtemh2/image/upload/v1708440483/whatsappClone/Default_Profile_ahjjqd.png",
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
