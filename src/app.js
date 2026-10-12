const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")

// used to convert string to readable json
app.use(express.json()) 

app.post("/signUp", async (req, res) => {
    const user = new User(req.body)
    try {
    await user.save();
    res.send("data added successfully!!!");
    } catch(err) {
    res.status(400).send("error in saving: " + err.message )
    }
})

//find one user
app.get("/getUser", async (req, res) => {
    try {
        const reqUser = await User.findOne({ firstName: req.body.firstName})
        res.send(reqUser)

    } catch (err) {
        res.send("something went wromg-", err)
    }
})


//find all user
app.get("/feed", async (req, res) => {
    try {
        const getUsers = await User.find({}) 
        res.send(getUsers)
    } catch (err) {
        res.send("something went wrong!!!")
    }
})


//delete user
app.delete("/deleteUser", async (req, res) => {
    id = req.body.userId
try {
const deletedUser = await User.findOneAndDelete({ _id: id })
console.log("delete-",deletedUser)
res.send("deleted successfully")
} catch(err) {
res.status(400).send("cannot delete!!")
}
})

//update
app.patch("/updateUser", async (req, res) => {
    const id = req.body._id
    const data = req.body
    try{
const upDatedValue = await User.findByIdAndUpdate(id, data, {returnDocument: "after"})
console.log("updated-",upDatedValue);
const message = "its time to test"
const ref = {upDatedValue, "mesage": message}
res.send(ref)

    } catch(err) {
res.status(400).send("Not updated!!!")
    }
})

connectDB()
  .then((res) => {
   
    app.listen(3000, () => {
      console.log("server started!!!");
    });
  })
  .catch((err) => {
  });

