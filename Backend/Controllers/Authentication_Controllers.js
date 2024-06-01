const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../Models/User_Model");
const otpModel = require("../Models/OTP_Verification_Model")
const generateToken = require("../Config/GenerateToken");
const {transporter} = require("../Services/Nodemailer_Transporter");
const sendOTPverificationEmail = async (_id, email, res) => {
    try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const mailOptions = {
        from: "pratyushnamdev140@gmail.com",
        to: email,
        subject: "Verify yout E-mail",
        html: `<p>Enter ${otp} in the app to verify</p>`,
      };
      const salt = await bcrypt.genSalt(10);
      const hashOTP = await bcrypt.hash(otp, salt);
      await otpModel.create({
        userId: _id,
        otp: hashOTP,
        createdAt: Date.now(),
        expiresOn: Date.now() + 360000,
      });
  
      await transporter.sendMail(mailOptions).then(() => {
        res.json({ needVerificationstatus: true, id: _id  , email:email});
      });
    } catch (error) {
      res.json({ error: true, id: null });
    }
  };

const signup = async (req, res) => {
    //cheching for any errors
    console.log(req.body);
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.json({error: true,  message: error.array() });
    }
     try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.json({ error: true, message: "E-mail already exist" });
      }
      
      const salt = await bcrypt.genSalt(10);
      //hashing the password
      const secPass = await bcrypt.hash(req.body.password, salt);
      await User.create({
        userName:req.body.userName,
        email: req.body.email,
        password: secPass,
        
      }).then((user) => {
        sendOTPverificationEmail(user._id, user.email, res);
      });
    } catch (err) {
      console.log(err)
      res.status(400).send({ error: true , message:"Internal Server error" });
    }
  }

  const login =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true , message:"Enter a valid email" });
    }
    const { email, password } = req.body;
    try {
      console.log(req.body);
      let user = await User.findOne({ email });
      if (!user) {
        return res.send({ error: true , message:"SignUp Required" });
      }
      if (!user.verified) {
        await otpModel.deleteMany({ userId: user._id });
        return sendOTPverificationEmail(user._id, user.email, res);
      }
      //checking the password
      let check = await bcrypt.compare(password, user.password);
      if (!check) {
        return res.send({ error: true , message:"Invalid Credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      let authToken = generateToken(data)
      res.json({ authToken, user, needVerificationstatus: false });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: true , message:"Internal Server Error" });
    }
  }


  const verifyOTP =  async (req, res) => {
    try {
     const { userId, otp } = req.body;
     if (!userId || !otp) {
       return res.json({ error: true , message:"Invalid request" });
     }
 
     let otpRecord = await otpModel.findOne({ userId });
 
     if (!otpRecord) {
       return res.json({
        error:true ,  message: "Email is already verified or not exist try by sign up again",
       });
     }
     if (otpRecord.expiresOn < Date.now()) {
       await otpModel.deleteMany({ userId });
       return res.json({
         error:true ,message: "OTP expired",
       });
     }
     const validOTP = await bcrypt.compare(otp, otpRecord.otp);
     if (!validOTP) {
       return res.json({
         error:true , message:"Incorrect OTP ... "
       });
     }
 
   
       await otpModel.deleteMany({ userId });
       await User.updateOne({ _id: userId }, { verified: true });
       const user = await User.findById(userId);
       const data = {
         user: {
           id: user._id,
         },
       };
 
       let authToken = generateToken(data);
       return res.json({
         success:true,
         authToken,
         user,
       
       });
     
 
   
   } catch (e) {
     console.log(e)
     res.json({ error: true , message:"Internal Server Error..." });
   }
 }

 module.exports = {signup , login , verifyOTP};