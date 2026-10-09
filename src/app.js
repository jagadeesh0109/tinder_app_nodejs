const express = require("express")

const app = express()

app.listen(3000, () => {
   console.log("server started!!!")
})

// app.get("/", (req, res) => {
// res.send("this is inside /")
// })

// app.get("/user", (req, res) => {
// res.send({name: "jagadeesh", status: 'single'})
// })

// app.get("/user", (req, res, next) => {
//     res.send("response for user !!")
//     next()
// })




// app.post("/body", (req, res) => {
//     res.send("successfully saved!!!")
// })

app.get("/getUserData", (req, res) => {
    try {
        throw new Error("random")
        res.send("inside try block")
    } 
    catch(err) {
res.status(500).send("catched the error")
    }
})