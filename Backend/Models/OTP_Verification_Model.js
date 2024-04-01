const mongoose= require("mongoose");

const {Schema} = mongoose;

const otpVerification = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:""
    },
    otp:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiresOn:{
        type:Date
    }
})
const otpModel = mongoose.model('otpVerification' , otpVerification)
module.exports = otpModel;