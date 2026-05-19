//create request router for request related routes
const express = require("express");
const User = require("../models/user");
//import userAuth middleware for authentication
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();


// add a post method with name sendconnection with logged in user in res
// http://localhost:3000/sendconnection
requestRouter.post("/sendconnection",userAuth, async (req, res) => {
  try {  
    
    const user =  req.user; // userId is set in userAuth middleware after verifying token
    res.send({ message: "Connection request sent successfully!-->"+user.firstName });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).send("Error sending connection request --->" + error.message);
  } 
});

module.exports = requestRouter;