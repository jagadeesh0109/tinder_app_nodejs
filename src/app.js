const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../src/middlewares/auth")


// used to convert string to readable json
app.use(express.json()) 
app.use(cookieParser())

app.post("/signUp", async (req, res) => {
   // const user = new User(req.body)
   const {password, firstName, lastName, emailId} = req.body
 try {
    // to encrypt the password while saving
   const passwordHash = await bcrypt.hash(password, 10)

   const user = new User ({
    firstName,
    lastName,
    emailId,
    password : passwordHash
   })
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
app.delete("/deleteUser", userAuth, async (req, res) => {
    id = req.body.userId
try {
const deletedUser = await User.findOneAndDelete({ _id: id })

res.send("deleted successfully")
} catch(err) {
res.status(400).send("cannot delete!!")
}
})

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User ot found!!");
    }

    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (ispasswordValid) {
      // add jwt token
      const token = await user.getJWT;
      res.cookie("token", token);

      res.send(user);
    } else {
      throw new Error("password incorrect");
    }
  } catch (err) {
    res.send("issue in login" + err.message);
  }
});

//update
app.patch("/updateUser", async (req, res) => {
  const id = req.body._id;
  const data = req.body;
  try {
    const upDatedValue = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    const message = "its time to test";
    const ref = { upDatedValue, mesage: message };
    res.send(ref);
  } catch (err) {
    res.status(400).send("Not updated!!!");
  }
});

//profile
app.get("/profile", async(req, res) => {
    try{
 const cookies = req.cookies;
    const {token} = cookies;
    if(!token) {
        throw new Error("token not found")
    }

    const decodedMessage = await jwt.verify(token, "Dev@Jaga")
    const {_id} = decodedMessage;
    const user = await User.findById(_id)
    if(!user) {
        throw new Error("usr not exist")
    }
    res.send(user);

    }
    catch(err) {

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

