const Koa = require('koa')
const bodyparser = require('koa-bodyparser')

const App = new Koa()
App.use(bodyparser())

module.exports = App
