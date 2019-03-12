const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyparser = require('koa-bodyparser')

const router = new KoaRouter()
const App = new Koa()
const PORT = process.env.PORT || 3000

router.get('/', async ctx => {
  ctx.body = 'Hello friend!'
})

App.use(bodyparser())
App.use(router.routes())

App.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
