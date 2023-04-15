const debug = require('debug')('app:client|pokemon|catchPokemon')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')

exports.catchPokemon = () => catchAsync(async (req, res, next) => {

    let halfProbability = Math.floor(Math.random() * 2)
    if (halfProbability === 0) {
        return next(new AppError('Failed to catch pokemon', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    res.status(200).json(responseHandler('Success to catch pokemon'))
})