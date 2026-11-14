require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../src/middlewares/auth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const http = require("http")

var cors = require("cors")
require("./utils/cornjob");

const initializeSocket = require("./utils/socket")


// used to convert string to readable json 
app.use(express.json()) 
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
}))
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)

const server = http.createServer(app);
initializeSocket(server)




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
    const savedUser = await user.save();
      const token = await savedUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000)
      });
    res.json({message: "User added successfully", data: savedUser})
    } catch(err) {
    res.status(400).send("error in saving: " + err.message )
    }
})

//find one user
app.get("/getUser", userAuth, async (req, res) => {
    try {
        const reqUser = await User.findOne({ firstName: req.body.firstName})
        res.send(reqUser)

    } catch (err) {
        res.send("something went wromg-", err)
    }
})


//find all user
app.get("/getAllUsers", userAuth, async (req, res) => {
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
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000)
      });

      res.send(user);
    } else {
      throw new Error("password incorrect");
    }
  } catch (err) {
     res.status(401).send("issue in login: " + err.message);
  }
});

//update
app.patch("/updateUser", userAuth, async (req, res) => {
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
app.get("/profile/view", userAuth, async(req, res) => {
    try{
 const cookies = req.cookies;
    const {token} = cookies;
    if(!token) {
        throw new Error("token not found")
    }

    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET)
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
    console.log("MongoDB connected successfully");

    server.listen(process.env.PORT, () => {
      console.log("server started!!!");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

