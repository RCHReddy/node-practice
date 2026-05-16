const jwt = require("jsonwebtoken");
const User = require("../models/user");


// use jwt token for user authentication here from cookies, you can replace this with actual authentication logic
const userAuth = async (req, res, next) => {
  
  try {
    
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
   
    const decoded = jwt.verify(token, "myjwtsecret");
    req.userId = decoded.id;
    //find user by id from database and attach to req.user
    req.user = await User.findById(req.userId);
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = {  userAuth };
