require('module-alias/register')
const {errorHandler, start, express, app} = require('@frameworks/express')
const routerExpress = express.Router()
const router = require('./router')(routerExpress)

app.use(`/pokemon`, router)

errorHandler()

start(process.env.CLIENT_RENAME_POKEMON_PORT)