const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyparser = require('koa-bodyparser')

const App = new Koa()
App.use(bodyparser())

const addMiddleware = middleware => {
  const router = new KoaRouter()
  router.post('/test', middleware, ctx => {
    ctx.body = 'test'
  })
  App.use(router.routes())
}

module.exports = {
  app: App,
  addMiddleware
}
