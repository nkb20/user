const {createLogger,format,transports} = require("winston")
const config = require("../config/Config")
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${level.toUpperCase().padEnd(7)}]: ${message}`;
});
const logger = createLogger({
    level: 'debug',
    format: combine(
        // label({ label: 'right meow!' }),
        timestamp(),
        myFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console({level:"debug"}),
        new transports.File({ filename: 'debug.log', level: config.logs.DEBUG }),
        new transports.File({ filename: 'error.log', level: config.logs.ERROR }),
    ],
});
module.exports = logger;