const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyparser = require('koa-bodyparser')

if (process.env.NODE_ENV === 'test') {
  const { connectDB } = require('./utils/tests/mongooseHelper')
  connectDB()
} else if (process.env.NODE_ENV === 'development') {
  const mongoose = require('mongoose')
  mongoose.connect(process.env.MONGO_URI_DEV, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
} else {
  const mongoose = require('mongoose')
  mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
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

router.post('/tools', async ctx => {
  try {
    const tool = ctx.request.body
    const newTool = new Tool(tool)
    const savedTool = await newTool.save()

    ctx.body = {
      id: savedTool.id,
      title: savedTool.title,
      description: savedTool.description,
      tags: savedTool.tags,
      link: savedTool.link
    }
    ctx.status = 200
  } catch (e) {
    ctx.throw(400, 'Bad request')
  }
})

router.delete('/tools/:id', async ctx => {
  try {
    const id = ctx.params.id || 0
    const { deletedCount } = await Tool.deleteOne({ id })
    if (deletedCount === 0) throw new Error('Not found')

    ctx.body = {}
    ctx.status = 200
  } catch (e) {
    ctx.throw(404, 'Not found')
  }
})

App.use(bodyparser())
App.use(router.routes())

module.exports = App
