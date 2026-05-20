// create connection request model for connection request related data
const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested","accepted", "rejected"],
        message: "Status must be either ignored, interested, accepted or rejected",
      }
    }
});

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;