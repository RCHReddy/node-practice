const express = require("express");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

// asd a post method to send connection request from logged in user to another user with user id in req body
// http://localhost:3000/request/send/:status/:toUserId
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {  
    const { status, toUserId } = req.params; 
    const allowedStatuses = ["ignored", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send("Invalid status. Allowed statuses are: ignored, interested");
    }
    const { _id: fromUserId } = req.user; // userId is set in userAuth middleware after verifying token
    if (fromUserId.toString() === toUserId) {
      return res.status(400).send("You cannot send connection request to yourself");
    } 
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).send("User not found");
    } 
    // check if connection request already exists between fromUserId and toUserId or toUserId and fromUserId
    const existingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });
    if (existingRequest) {
      return res.status(400).send("Connection request already exists");
    }
    // create new connection request
    const newRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status
    });
    await newRequest.save();

    res.status(201).send(`Connection request ${fromUserId} to ${toUserId} with status ${status} sent successfully`);
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).send("Error sending connection request --->" + error.message);
  }
});


//add a post method to review the connection request with status and request id in req params
// http://localhost:3000/request/review/:requestId/:status
requestRouter.post("/request/review/:requestId/:status", userAuth, async (req, res) => {
  try {
    const { requestId, status } = req.params;
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send("Invalid status. Allowed statuses are: accepted, rejected");
    }
    const { _id: userId } = req.user;
    const request = await ConnectionRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).send("Connection request not found");
    }
    if (request.toUserId.toString() !== userId.toString()) {
      return res.status(403).send("You are not the recipient of this connection request");
    }
    request.status = status;
    await request.save();
    res.send(`Connection request ${requestId} updated successfully with status ${status}`);
  } catch (error) {
    console.error("Error reviewing connection request:", error);
    res.status(500).send("Error reviewing connection request --->" + error.message);
  }
});

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