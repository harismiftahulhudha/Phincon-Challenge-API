const controller = require('./controller')

module.exports = (router) => {

    router.post('/', controller.renamePokemon())

    return router
}