const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")


app.post("/signUp",async (req, res) => {
    const user = new User({
        firstName: "Sachin",
        lastName: "Tendulkar",
        emailId: "sachin99@gmail.com",
        password: "sachin@123"
    })
    try {
    await user.save();
    res.send("data added successfully!!!");
    } catch(err) {
    res.status(400).send("error in saving: ", err.message )
    }
})


connectDB()
  .then((res) => {
    console.log("ln9-", res);
    app.listen(3000, () => {
      console.log("server started!!!");
    });
  })
  .catch((err) => {
    console.log("ln12-", err);
  });

app.listen(3000, () => {
  console.log("server started!!!");
});
