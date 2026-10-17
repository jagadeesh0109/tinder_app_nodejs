const express = require("express")
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")
const profileRouter = express.Router()

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
try {
if(!validateEditProfileData(req)) {
    throw new Error("Invalid eidt request")
   
} 
 const loggedInUser = req.user;

 // loggedInUser.firstName = req.body.firstName. --this can be writtern as 
 Object.keys(req.body).forEach((fields) => {
(loggedInUser[fields] = req.body[fields])
 })
 await loggedInUser.save()
 res.json({message: "updated success", data: loggedInUser} )
} catch(err) {
res.status(400).send("error: " + err.message);

}
})

module.exports = 
    profileRouter

