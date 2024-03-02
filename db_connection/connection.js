const mongoose = require("mongoose")
require('dotenv').config()
const config = require("../config/Config")
var logger = require('morgan');


const dbconnect = async () => {
    try {
       await mongoose.connect(`${config.URL}/${config.USERDB}`)
        console.log("database connected succesfully");
    } catch (err) {
        throw new Error("database not connected"+err)
    }
}

module.exports={dbconnect}