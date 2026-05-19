//create router for authentication routes
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
//import validatePayload function from utils/validate.js
const { validatePayload } = require("../utils/validate");
const  authRouter = express.Router();    
authRouter.post("/signup", async (req, res) => {
  console.log("signup route accessed-----", req.body);

  try {
    const { firstName, lastName, email, password } = req.body;
    validatePayload
    const errors = validatePayload({ firstName, lastName, email, password });

    if (errors) {
      return res.status(400).send(errors);
    }

    // hash password before saving to database using bcrypt npm package
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.send("user created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user" + error.message);
  }
});
// login user by email and password
// http://localhost:3000/login
authRouter.post("/login", async (req, res) => {    
  console.log("login route accessed-----", req.body);
  try {
    const { email, password } = req.body;
    //  fetch user by email from database
    const user = await User.findOne({ email }); 
    // if user not found, return error
    if (!user) {
      return res.status(404).send("User not found");
    } 
    // compare password with hashed password in database using bcrypt npm package
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }   
    // send some dummy token in cookies for authentication (in real application, you should use JWT or similar token)
    // expire jwt and cookie after 8 hours
    const token = user.getJwt(); // generate JWT token using getJwt method defined in user model
    res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 8 * 60 * 60 * 1000 ) });
    res.send("User logged in successfully!"); 
} catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user" + error.message);
  } 
});     

//logout user by clearing the token cookie
// http://localhost:3000/logout
// why this route should be post? 
// because it modifies the server state (clearing the cookie) and is not a safe HTTP method
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("User logged out successfully!");
});
module.exports = authRouter;