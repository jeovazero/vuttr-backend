const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyparser = require('koa-bodyparser')
const helmet = require('koa-helmet')
const App = new Koa()
const router = new KoaRouter()

if (process.env.NODE_ENV === 'test') {
  const { connectDB } = require('./helpers/tests/mongooseTestHelper')
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

require('./models/Tool')
const toolsService = require('./components/tools/tools.service')

router.use('/api/v1/tools', toolsService.routes())

App.use(helmet())
App.use(bodyparser())
App.use(router.routes())

module.exports = App
