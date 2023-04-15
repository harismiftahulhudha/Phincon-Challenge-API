const Joi = require("joi")
const debug = require('debug')('app:client|pokemon|renamePokemon')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')
const fibonacci = require('@utils/fibonacci')

exports.renamePokemon = () => catchAsync(async (req, res, next) => {
    const schema = Joi.object({
        index: Joi.number().greater(-1).required(),
        nickname: Joi.string().required()
    })

    const {error} = schema.validate(req.body)
    if (error) {
        return next(new AppError(error.message.replace(/"/g, ''), 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    let valueNickname = `${req.body.nickname}-${fibonacci(req.body.index)}`

    res.status(200).json(responseHandler(valueNickname))
})