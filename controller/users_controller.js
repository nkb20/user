const { Error } = require("mongoose");
const user_model = require("../model/user_model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const { InvalidInputException } = require("../custom_error/custom_error")
const nodemailer = require("nodemailer");
const { link } = require("../routes/product");
const Config = require("../config/Config");
const JsonResponse = require("../model/response_model")
const ejs = require("ejs")
const path = require("path")
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const userRole = require("../services/user-role");
const exp = require("constants");
const { tokenExpireTime } = require("../services/token-expire-time")
const { UPRSchema, UPRModel } = require("../model/users-password-reset");
var Ajv = require("ajv");
var ajv = new Ajv();
const uuidId = uuidv4();
var log = require("../loaders/logger")



const handleUserRegistration = async function (req, res, next) {
  const new_user = req.body;

  var role = userRole.USER;
  // const values = Object.values(userRole)
  // log.debug("role  "+role)

  if (role.includes(new_user.role)) {
    role = new_user.role;
  }

  const { userName, firstName, middleName, lastName, emailId, mobileNumber, city, state, pinCode, password } = new_user;

  const user_name = userName.toLowerCase();
  const encrypted_password = await bcrypt.hash(password, 10);

  try {
    if (!new_user.userName || !new_user.emailId) {
      throw new InvalidInputException("Username and email id can't be empty")
    }
    const user = await user_model.create({
      user_name: user_name,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email_id: emailId,
      mobile_number: mobileNumber,
      city: city,
      state: state,
      code: pinCode,
      password: encrypted_password,
      role: role

    })
    res.status(201).json(JsonResponse.success("Succesfully registered", { id: user._id }))
    log.info(`User registered with userId ${user._id}`)

  }

  catch (exception) {
    log.info(exception)
    if (exception instanceof InvalidInputException) {
      return next(exception)
    }
    log.debug("User name or email id already registered")
    res.status(400).json(JsonResponse.error("User name or email id already registered"))
  }
}


const handleUserLogin = async (req, res, next) => {
  const data = req.body;
  try {

    if (!data.userName || !data.password) {
      throw new InvalidInputException("All fields are required")
    }

    const user = await user_model.findOne({ user_name: data.userName.toLowerCase() });

    if (!user) {
      throw new InvalidInputException("Incorrect user name or password")
    }
    const expTime = Config.jwtpayload.exp;

    const isPassword = await bcrypt.compare(data.password, user.password);

    if (isPassword) {
      const jwtPayload = {
        iss: undefined,
        sub: undefined,
        aud: undefined,
        exp: undefined,
        nbf: undefined,
        iat: undefined,
        jti: undefined,
        role: undefined
      };
      jwtPayload.iss = Config.jwtpayload.iss;
      jwtPayload.sub = user.user_name;
      jwtPayload.exp = Math.floor(expTime.getTime() / 1000);
      jwtPayload.nbf = Config.jwtpayload.nbf;
      jwtPayload.iat = Config.jwtpayload.iat;
      jwtPayload.jti = uuidId;
      jwtPayload.role = user.role;

      const generatedToken = jwt.sign(jwtPayload, process.env.PUBLIC_KEY)
      log.debug(`Token generated for userId ${user.user_id}`)

      res.status(201).json(JsonResponse.success("Token generated succesfully", { token: generatedToken }))

    }
    else {
      res.status(400).json(JsonResponse.error("Incorrect user name or password"))
      return;
    }
  }
  catch (exception) {
    if (exception instanceof InvalidInputException) {
      log.info(exception.message);
      next(exception)
    }
    else {
      log.debug(exception.message);
      next(exception);
    }

  }

}

const handleChangePassword = async (req, res, next) => {
  const data = req.body;

  log.debug
  try {
    if (!data.newPassword || !data.confirmPassword) {
      throw new InvalidInputException("All fields are mendatory", 400);
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new InvalidInputException("Password doesn't match", 400);
    }

    const encrypted_password = await bcrypt.hash(data.newPassword, 10);

    const user = await user_model.findOneAndUpdate(req.user._id, { password: encrypted_password })
    res.json(JsonResponse.success("Password has been changed."));

  }
  catch (exception) {
    if (exception instanceof InvalidInputException) {
      next(exception)
      log.debug(exception)
      return;
    }
    else {
      log.debug(exception)
      next(exception)
    }


  }
}


const handleGenerateForgotURL = async (req, res, next) => {
  const data = req.body;
  const UPRPayload = {};
  try {
    if (!data.userName) {
      throw new InvalidInputException("Please enter user name", 400)
    }

    const user = await user_model.findOne({ user_name: data.userName.toLowerCase() })
    if (!user) {
      throw new InvalidInputException("Invalid user name", 400);
    }

    const URL = `${process.env.PASSWORD_RESET_URL}${uuidId}`

    UPRPayload.user_id = user._id;
    UPRPayload.link = URL;
    UPRPayload.uuid = uuidId;
    UPRPayload.expiryTime = Config.PASSWORD_RESET_LINK_TIME


    const filePath = path.join(__dirname, '../views/reset-password-et.ejs');
    var renderedHTML = null;
    if (fs.existsSync(filePath)) {
      ejs.renderFile(filePath, { url: URL }, function (err, page) {
        if (err) {
          throw new InvalidInputException("Internal Server Error", 500)
        }
        renderedHTML = page
      });
    } else {
      throw new InvalidInputException("file not found", 404)
    }

    Config.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email_id, // list of receivers
      subject: process.env.EMAIL_SUB, // Subject line
      text: process.env.EMAIL_TEXT, // plain text body
      html: renderedHTML
    },
      async (err, data) => {

        if (err) {
          next(new InvalidInputException(err.message, 404))
        }
        else {
          res.status(201).json(JsonResponse.success("Reset link has been send in user's registered email id", URL))
          await UPRModel.create(UPRPayload)

        }
      })


  } catch (exception) {
    if (exception instanceof InvalidInputException) {
      next(exception)
      log.debug(exception)
      return;
    }
    else {
      log.debug(exception)
      next(exception)
    }


  }
}

const handleForgotPassword = async (req, res, next) => {

  const { uuId } = req.params;
  const data = req.body;

  const fetchUUIddetails = await UPRModel.findOne({ uuid: uuId })
  if (fetchUUIddetails) {
    if (fetchUUIddetails.visited == true) {
      if (fetchUUIddetails.expiryTime <= new Date()) {
        return res.json(JsonResponse.error("Link has expired"))
      }
      return res.json(JsonResponse.error("This verification link has already been used"))
    }

    try {
      if (!data.new_password || !data.confirm_password) {
        throw new InvalidInputException("All fields are mendatory", 400);
      }
      if (data.new_password !== data.confirm_password) {
        throw new InvalidInputException("Password doesn't match", 400);
      }

      const encrypted_password = await bcrypt.hash(data.new_password.toString(), saltRounds);

      await user_model.findByIdAndUpdate({ _id: fetchUUIddetails.user_id }, { password: encrypted_password });
      await UPRModel.findOneAndUpdate({ uuid: uuId }, { visited: true })
      res.json(JsonResponse.success("Password has been changed succesfully"))

    }
    catch (exception) {
      if (exception instanceof InvalidInputException) {
        log.info(exception)
        return next(exception);
      }
      else {
        log.debug(exception)
        next(exception)
      }


    }
  }

  else {

    return res.json(JsonResponse.error("invalid link"))
  }

}

const handleTokenDetails = async (req, res, next) => {
  const user = req.user;
  res.status(201).json(JsonResponse.success("User found", { user: user }))

}


module.exports = { handleUserRegistration, handleUserLogin, handleChangePassword, handleGenerateForgotURL, handleForgotPassword, handleTokenDetails }