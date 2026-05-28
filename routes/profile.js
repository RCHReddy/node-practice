
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileUpdatePayload } = require("../utils/validate");
const { validateStrongPassword } = require("../utils/validate");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

// view user profile
// http://localhost:3000/profile/view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try { 
    const userId = req.userId; // userId is set in userAuth middleware after verifying token
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Error fetching profile"+ error.message);
  }
});
// update user profile using patch method
// http://localhost:3000/profile/update
profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    
    const isValidPayload = validateProfileUpdatePayload(req.body);
    if (!isValidPayload) {
      return res.status(400).send("Invalid payload. Only firstName, lastName, email, gender, age, about, skills and photo fields are allowed for update.");
    }
    const user = req.user; // user is set in userAuth middleware after verifying token
    const updates = req.body;
    Object.assign(user, updates);
    await user.save();
    // send json response with updated user details except password
    res.status(200).json({
      user:user.toJSON(), // toJSON method in user model will remove password field from response
      message: "Profile updated successfully!"
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      error: "Error updating profile" + error.message
    });
  }
}); 

//patch method for profile password update
// http://localhost:3000/profile/password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).send("Password is required");
    } else if (!validateStrongPassword(password)) {
      return res.status(400).send("Password must contain 8 characters, including uppercase, lowercase, number and symbol");
    } 
    const user = req.user; // user is set in userAuth middleware after verifying token
    user.password = await bcrypt.hash(password, 10); // password will be hashed in user model pre save hook
    await user.save();
    res.status(200).json({
      message: "Password updated successfully!"
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      error: "Error updating password" + error.message
    });
  }  
});  

module.exports = profileRouter;