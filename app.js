const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyparser = require('koa-bodyparser')

if (process.env.NODE_ENV === 'test') {
  const { connectDB } = require('./utils/tests/mongooseHelper')
  connectDB()
}

const Tool = require('./models/Tool')

const router = new KoaRouter()
const App = new Koa()

router.get('/', async ctx => {
  ctx.body = 'Hello friend!'
})

router.get('/tools', async ctx => {
  const tag = ctx.query.tag || ''
  const tools = await Tool.find({}, { _id: 0, __v: 0 }).sort({ id: 1 })

  if (tag.length > 0) {
    ctx.body = tools.filter(el => {
      return el.tags.includes(tag)
    })
  } else {
    ctx.body = tools
  }
})

App.use(bodyparser())
App.use(router.routes())

module.exports = App
