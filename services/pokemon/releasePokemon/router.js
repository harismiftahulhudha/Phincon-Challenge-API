const controller = require('./controller')

module.exports = (router) => {

    router.get('/', controller.releasePokemon())

    return router
}