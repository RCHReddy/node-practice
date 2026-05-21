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
// create index to mke db queries faster for fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
// add pre schema middleware to check if fromUserId and toUserId are the same before saving connection request
connectionRequestSchema.pre("save", async function (next) {
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    return next(new Error("You cannot send connection request to yourself"));
  }
  next();
});
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;