const express = require("express");
const router = express.Router();
const Authentication_Controllers = require("../Controllers/Authentication_Controllers");
const { body } = require("express-validator"); 
router.post(
  "/signup",
  [
    //validation of the data
    body("userName").isLength({ min: 3 }),
    body("email").isEmail().withMessage("Please enter a valid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be a set of atleast 6 letters"),
  ],
  Authentication_Controllers.signup
);
router.post("/verifyOTP" , Authentication_Controllers.verifyOTP);

router.post("/login", [
  body("email").isEmail().withMessage("Please enter a valid Email"), Authentication_Controllers.login
]);

module.exports = router;
