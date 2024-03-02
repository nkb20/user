const nodemailer = require("nodemailer");
require('dotenv').config()

const date = new Date();
const time = date.getTime();
const expTime = new Date(time);
expTime.setMinutes(expTime.getMinutes() + +process.env.EXPIRE_MIN);
expTime.setHours(expTime.getHours() + +process.env.EXPIRE_HOURS);


const passwordResetTime = new Date(time);
passwordResetTime.setMinutes(passwordResetTime.getMinutes() + +process.env.PASSWORD_RESET_TIME_MINS)

module.exports = {

    USERDB: "usersDB",
    URL: "mongodb://localhost:27017",
    PASSWORD_RESET_LINK_TIME: passwordResetTime,
    transporter: nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }),

    jwtpayload: {
        iss: "iklyle-auth-server",
        aud: undefined,
        exp: expTime,
        nbf: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        jti: undefined,
        role: undefined
    },


    logs: {
        ERROR: "error",
        WARN: "warn",
        INFO: "info",
        HTTP: "http",
        VERBOSE: "verbose",
        DEBUG: "debug",
        SILLY: "silly",
    },

    DEFAULT_PAGE_NUMBER:1,
    DEFAULT_PAGE_SIZE:5,

}