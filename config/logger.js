const winston = require('winston');
require('winston-daily-rotate-file');
const DiscordTransport = require('winston-discord-transport').default;

const env = process.env.NODE_ENV || 'development';
const logLevel = env === 'production' ? 'warn' : 'debug';

//* Transport xoay vòng tệp log hàng ngày
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

//* Transport ghi log lỗi vào tệp riêng biệt
const errorFileTransport = new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
});

//* Transport gửi log đến Discord cho error, warn và info
const discordTransportError = new DiscordTransport({
    webhook: process.env.DISCORD_WEBHOOK_URL,
    level: 'error',
    defaultMeta: { service: 'user-service' },
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    )
});

const discordTransportWarn = new DiscordTransport({
    webhook: process.env.DISCORD_WEBHOOK_URL,
    level: 'warn',
    defaultMeta: { service: 'user-service' },
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    )
});

const discordTransportInfo = new DiscordTransport({
    webhook: process.env.DISCORD_WEBHOOK_URL,
    level: 'info',
    defaultMeta: { service: 'user-service' },
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    )
});

const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }), // Bao gồm stack trace cho log lỗi
        winston.format.json() // Sử dụng định dạng JSON để dễ phân tích
    ),
    defaultMeta: { service: 'user-service' }, // Thêm metadata mặc định
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        dailyRotateFileTransport,
        errorFileTransport,
        discordTransportError,
        discordTransportWarn,
        discordTransportInfo
    ]
});

module.exports = logger;
