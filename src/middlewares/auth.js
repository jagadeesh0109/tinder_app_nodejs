const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("please Login!!!")
    }

    const decodedObj = await jwt.verify(token, "Dev@Jaga");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    req.user = user
    if (!user) {
      throw new Error("User not found");
    }

    next();
  } catch (err) {
    res.status(400).send("ERROR:" + err.message)
  }
};

module.exports = {
    userAuth
}
