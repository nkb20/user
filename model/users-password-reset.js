const mongoose = require("mongoose")

const UPRSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    link: {
        type: String,
        require: true
    },
    uuid: {
        type: String,
        require: true

    },
    expiryTime: {
        type: Date,
        required: true
    },
    visited: {
        type:Boolean,
        default: null,
    }

})

const UPRModel = mongoose.model("UserPasswordReset", UPRSchema, "UserPasswordReset")

module.exports = { UPRSchema, UPRModel }