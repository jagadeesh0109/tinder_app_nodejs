const mongoose = require("mongoose");
const validator = require("validator")

const userSchema  = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        validator(value) {
            if(!validator.isEmail(value)) {
                throw new Error("invalid email address")
            }
        }

    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
}, 
{
    timestamps: true
});

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dev@Jaga" ,{expiresIn: '7d'})
    console.log("token in userschema-", token)
    console.log("user-", user)
    return token;
}

const User = mongoose.model("User", userSchema);


module.exports = User;