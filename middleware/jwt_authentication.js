const jwt = require("jsonwebtoken")
require('dotenv').config()
const { InvalidInputException } = require("../custom_error/custom_error")
const user_model = require("../model/user_model");
const JsonResponse = require("../model/response_model")
const log = require("../loaders/logger")


const handleTokenAuthentication = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        if(!authorizationHeader){
        return res.json(JsonResponse.error("Unauthorize access, please sign in"))

        }
        log.debug("Invalid token")
        return res.json(JsonResponse.error("Invalid token"))
    }

    const token = authorizationHeader.split(" ")[1];

    try {
        var decoded_token = jwt.verify(token, process.env.PUBLIC_KEY)
        const user = await user_model.findOne({ user_name: decoded_token.sub }).select("-password")
        if (!user) {
            throw new InvalidInputException("User not found", 404)
        }
        req.user=user;
        log.info(`User id= ${user._id} authenticated succefully`)
    }
    catch (exception) {
        if (exception instanceof InvalidInputException) {
            return next(exception)
        }
        else {
            const error = new Error(exception.message);
        error.statusCode = 404;
        return next(error);
        }

    }
    next();
}

module.exports = { handleTokenAuthentication };