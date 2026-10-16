const express = require("express")
const authRouter = express.Router()

authRouter.post("/logout", (req, res) => {
    // res.cookie("token", null, {
    //     expires: new Date(Date.now())
    // });
     res.clearCookie("token");
    res.send("logged ut successfully")
})

module.exports = authRouter