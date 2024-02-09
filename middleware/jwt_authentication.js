const jwt = require("jsonwebtoken")
require('dotenv').config()
const { InvalidInputException } = require("../custom_error/custom_error")
const user_model = require("../model/user_model");
const JsonResponse = require("../model/response_model")
const log = require("../loaders/logger")


const handleTokenAuthentication = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        log.debug("Invalid token")
        return res.json(JsonResponse.error("Invalid token"))

    }
    const token = authorizationHeader.split(" ")[1];

    try {
        var decoded_token = jwt.verify(token, process.env.PUBLIC_KEY)

        // const user = await user_model.findOne({ user_name: decodedBody.sub }).select("-password")

        // if (!user) {
        //     throw new InvalidInputException("User not found", 404)
        // }
        req.user_name = decoded_token.sub;
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
    next();
}

module.exports = { handleTokenAuthentication };