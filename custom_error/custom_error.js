class InvalidInputException extends Error {
    constructor(message, statusCode = 200) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidInputException);
        }
    }
}

module.exports = { InvalidInputException };
