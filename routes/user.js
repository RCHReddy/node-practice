// add new user router
const express = require("express");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
// creat ea get method to get all  requests for logged in user which are in interested status
// these requests are pending and to be marked as accepted or rejected by logged in user
// http://localhost:3000/user/requests/received

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const {_id: userId} = req.user; // user is set in userAuth middleware after verifying token
    const requests = await ConnectionRequestModel.find({ toUserId: userId, status: "interested" }).populate("fromUserId", "firstName lastName email");
    res.status(200).send(requests);
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res.status(500).send("Error fetching received requests --->" + error.message);
  }
}); 

module.exports = userRouter;

