const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyparser = require('koa-bodyparser')
const helmet = require('koa-helmet')
const App = new Koa()
const router = new KoaRouter()
const { mongooseConfig } = require('./db')

if (process.env.NODE_ENV === 'development') {
  const mongoose = require('mongoose')
  mongoose.connect(process.env.MONGO_URI_DEV, mongooseConfig)
} else if (process.env.NODE_ENV === 'production') {
  const mongoose = require('mongoose')
  mongoose.connect(process.env.MONGO_URI, mongooseConfig)
}

// require('./models/User')

const { toolsService } = require('./components/tools')
const { authMiddleware, authService } = require('./components/auth')

router.use('/api/v1/auth', authService.routes())
router.use('/api/v1/tools', authMiddleware, toolsService.routes())

App.use(helmet())
App.use(bodyparser())
App.use(router.routes())

module.exports = App
