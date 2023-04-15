const controller = require('./controller')

module.exports = (router) => {

    router.get('/', controller.catchPokemon())

    return router
}