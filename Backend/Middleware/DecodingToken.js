const jwt = require("jsonwebtoken")
const DecodingToken = (req , res , next)=>{
    const token = req.header("authToken");
    if(!token){
        return res.status(401).json({error : true , message:"Access Denied"})
    }
    try{
        let decoded = jwt.verify(token , process.env.JWT_KEY);
       
        req.user = decoded.user;
    
        next();
    }catch(e){
        console.log(e)
        res.status(401).json({error : true , message:"Access Denied"});
    }
}
module.exports = DecodingToken;