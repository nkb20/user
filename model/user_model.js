const mongoose = require("mongoose");
const { message } = require("../config/Config");

const user_mongoose = new mongoose.Schema({
    
    user_name:{
        type:String,
        required: [true,"User name is required"],
        unique: true
    },
    first_name: {
        type: String,
        required: true

    },
    middle_name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: false,
    },
    email_id: {
        type: String,
        required: [{msg:"Email id is required"}],
        unique: true
    },
    mobile_number: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    role:{
        type:String
    }
});
module.exports = mongoose.model("users", user_mongoose)