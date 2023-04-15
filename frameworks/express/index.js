const debug = require('debug')('app:express')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const AppError = require('@utils/appError')
const globalErrorHandler = require('@utils/errorHandler')

const app = express()

// Set Securty HTTP headers
app.use(helmet())
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!',
    handler: function (req, res, next, options) {
        next(new AppError('Too many requests from this IP, please try again in 15 minutes!', 429))
    }
})
app.use('/api', limiter)

// Cors
app.use(cors())

// Body parser, reading from body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
    ]
}))

process.on("uncaughtException", err => {
    debug('UNCAUGHT EXCEPTION! Shutting down...')
    debug(err.name, err.message)
    process.exit(1)
})

process.on('unhandledRejection', err => {
    debug(err.name, err.message)
    debug('UNHANDLER REJECTION! Shutting down...')
    server.close(() => {
        process.exit(1)
    })
})

const http = require('http')
const server = http.createServer(app)

module.exports.errorHandler = () => {
    app.all('*', (req, res, next) => {
        // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
        // err.status = 'fail'
        // err.statusCode = 404

        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
    })
    app.use(globalErrorHandler)
}

module.exports.start = (port) => {
    const newPort = port || 3000
    server.listen(newPort, () => {
        debug(`Listening on 127.0.0.1:${newPort}`)
    })
}

module.exports.express = express

module.exports.server = server

module.exports.app = app