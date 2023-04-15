const debug = require('debug')('app:client|pokemon|catchPokemon')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')

exports.releasePokemon = () => catchAsync(async (req, res, next) => {

    let random = Math.floor(Math.random() * 100)

    res.status(200).json(responseHandler(random))
})