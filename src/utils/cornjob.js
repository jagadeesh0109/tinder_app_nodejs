const { subDays, endOfDay, startOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail")

cron.schedule("30 8 * * *", async () => {
   
 
    try{
const yesterday = subDays(new Date() , 1);
const yesterdayStart = startOfDay(yesterday);
const yesterdayStop = endOfDay(yesterday)

const pendingRequests = await ConnectionRequestModel.find({
    status: "interested",
    createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayStop
    }
}).populate("fromUserId toUserId");

const listOfEmails = [...new Set(pendingRequests.map((req) => req.toUserId.emailId))]

for(const email of listOfEmails) {
    try{
const res = await sendEmail.run("new request pending " + email, " Many requestsare pending for approval")
    }
    catch(err) {
        console.log(err)
    }
}

    }
    catch(err) {
        console.log("err", err)
    }
});