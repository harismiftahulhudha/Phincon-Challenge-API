const AppError = require('./../utils/appError')
const constants = require('./../utils/constants')

const handleCatchErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400)
}

const sendErrorDev = (err, req, res) => {
    console.log(err.message)
    let code = err.code
    let statusCode = err.statusCode
    let message = err.message
    if (err.code === 'ECONNREFUSED') {
        statusCode = 404
        code = constants.STATUS_CODE.SERVER_ERROR
        message = `Can't find ${req.originalUrl} on this server!`
    }
    res.status(statusCode).json({
        meta: {
            success: false,
            code: code,
            message:message,
            // status: err.status,
            stack: err.stack
        },
        data: null
    })
}

const sendErrorProd = (err, req, res) => {
    let code = err.code
    let statusCode = err.statusCode
    let message = err.message
    if (err.code === 'ECONNREFUSED') {
        statusCode = 404
        code = constants.STATUS_CODE.SERVER_ERROR
        message = `Can't find ${req.originalUrl} on this server!`
    }

    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(statusCode).json({
            meta: {
                success: false,
                code: code,
                message: message,
                // status: err.status
            },
            data: null
        })
    }
    // Programming or other unknown error: don't leak error details
    else {
        // 1) Log error
        console.error('ERROR', err)

        // 2) Send generic message
        res.status(500).json({
            meta: {
                success: false,
                code: constants.STATUS_CODE.SERVER_ERROR,
                // status: 'error',
                message: 'Something went very wrong!',
            },
            data: null
        })
    }
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again,', 401)

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    // err.status = err.status || 'error'
    err.code = err.code || '-1'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err)
        if (error.name === 'CastError') error = handleCatchErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()
        sendErrorProd(error, req, res)
    }
}