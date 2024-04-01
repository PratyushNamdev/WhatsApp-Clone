const jwt = require("jsonwebtoken");

const generateToken = (data) => {
    console.log(process.env.JWT_KEY)
  return jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;