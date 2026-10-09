const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://bjagadeesh838_db_user:Sb3Y5rRToZeJj1I3@jegxletsbegin.u30ni30.mongodb.net/developTinder",
  );
};

module.exports = connectDB;
