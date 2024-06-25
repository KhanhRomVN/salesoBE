const winston = require('winston');
require('winston-daily-rotate-file');
const DiscordTransport = require('winston-discord-transport').default;

const env = process.env.NODE_ENV || 'development';
const logLevel = env === 'production' ? 'warn' : 'debug';

//* Hàm tạo transport xoay vòng tệp log hàng ngày
const createDailyRotateFileTransport = () => new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

//* Hàm tạo transport ghi log lỗi vào tệp riêng biệt
const createErrorFileTransport = () => new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
});

//* Hàm tạo transport gửi log đến Discord với các mức độ khác nhau
const createDiscordTransport = (level) => new DiscordTransport({
    webhook: process.env.DISCORD_WEBHOOK_URL,
    level,
    defaultMeta: { service: 'user-service' },
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    )
});

//* Hàm tạo transport cho console
const createConsoleTransport = () => new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
});

//* Tạo logger với các transport đã định nghĩa
const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }), // Bao gồm stack trace cho log lỗi
        winston.format.json() // Sử dụng định dạng JSON để dễ phân tích
    ),
    defaultMeta: { service: 'user-service' }, // Thêm metadata mặc định
    transports: [
        createConsoleTransport(),
        createDailyRotateFileTransport(),
        createErrorFileTransport(),
        createDiscordTransport('error'),
        createDiscordTransport('warn'),
        createDiscordTransport('info')
    ]
});

module.exports = logger;
