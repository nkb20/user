class InvalidInputException extends Error {

    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidInputException);
        }
        console.log(this.stack)


    }

}
module.exports=InvalidInputException