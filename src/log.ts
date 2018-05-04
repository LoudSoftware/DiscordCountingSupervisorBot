import * as winston from 'winston';

export const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            level: 'debug',
        }),
        new (winston.transports.File)({
            filename: 'debug.log',
            level: 'error',
        }),
    ],
});
