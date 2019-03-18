const KoaRouter = require('koa-router')
const router = new KoaRouter()
const toolsRoutes = require('./tools')

router.get('/', async ctx => {
  ctx.body = 'Hello friend!'
})

router.use('/tools', toolsRoutes.routes())

module.exports = router.routes()
