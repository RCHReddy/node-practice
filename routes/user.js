// add new user router
const express = require("express");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();

const SELECTED_USER_FIELDS = "firstName lastName email photo gender age";
// creat ea get method to get all  requests for logged in user which are in interested status
// these requests are pending and to be marked as accepted or rejected by logged in user
// http://localhost:3000/user/requests/received

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const { _id: userId } = req.user; // user is set in userAuth middleware after verifying token
    const requests = await ConnectionRequestModel.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", SELECTED_USER_FIELDS);
    res.status(200).json({requests});
  } catch (error) {
    console.error("Error fetching received requests:", error);
    res
      .status(500)
      .json("Error fetching received requests --->" + error.message);
  }
});

// add a get method to get all connections for logged in user
// http://localhost:3000/user/connections
// GET /user/connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const { _id: userId } = req.user;

    // Single query to fetch accepted connections where the user is either side
    const connections = await ConnectionRequestModel.find({
      status: "accepted",
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .populate("fromUserId", SELECTED_USER_FIELDS)
      .populate("toUserId", SELECTED_USER_FIELDS)
      .lean();

    

    return res
      .status(200)
      .json(
        connections.map((connection) =>
          connection.fromUserId._id.toString() === userId.toString()
            ? connection.toUserId
            : connection.fromUserId,
        ),
      );
  } catch (error) {
    console.error("Error fetching connections:", error);
    return res
      .status(500)
      .json("Error fetching connections ---> " + error.message);
  }
});

// add a get method to get all users with no interaction between logged in user and these users, they are new to logged in user
// http://localhost:3000/feed/
// apply pagination to this method with page and limit query params, default page = 1 and limit = 10
// GET /feed/
// returns users that have NO prior interaction with the logged-in user
userRouter.get("/feed/", userAuth, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    let limit = Math.max(1, parseInt(req.query.limit) || 10);
    limit = Math.min(limit, 100); // cap limit to 100 to prevent abuse
    const skip = (page - 1) * limit;

    // 1) compute IDs of users who have any interaction with the logged-in user
    // Use two distinct queries to avoid retrieving whole documents
    const [toIds, fromIds] = await Promise.all([
      ConnectionRequestModel.distinct("toUserId", { fromUserId: userId }),
      ConnectionRequestModel.distinct("fromUserId", { toUserId: userId }),
    ]);

    const interactedIdsSet = new Set([
      ...toIds.map(String),
      ...fromIds.map(String),
      String(userId), // exclude self as well
    ]);
    const interactedIds = Array.from(interactedIdsSet);

    // 2) fetch paginated users NOT in interactedIds
    const query = { _id: { $nin: interactedIds } };
    const projection = `_id ${SELECTED_USER_FIELDS}`; // keep using existing constant

    const [users, total] = await Promise.all([
      User.find(query).select(projection).lean().skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      users,
    });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return res.status(500).send("Error fetching suggested users ---> " + error.message);
  }
});



module.exports = userRouter;
