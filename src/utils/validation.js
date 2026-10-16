const valiadtor = require("validator")

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId"]
   const isEditAllowed =  Object.keys(req.body).every(field => {
       return allowedEditFields.includes(field)
    })
    return isEditAllowed
}

module.exports = {
    validateEditProfileData
}