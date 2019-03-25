const mongoose = require('mongoose')
const User = require('../../models/User')

const mongooseOpts = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  promiseLibrary: Promise,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
}

const populateDB = async () => {
  const fakeTools = require('../fakedata/tools.json')
  const fakeUser = require('../fakedata/user.json')
  await new User(fakeUser).save()
  await Promise.all(
    fakeTools.map(tool => {
      return User.findByEmailAndAddTool(fakeUser.email, tool)
    })
  )
}

const clearDB = async () => {
  return mongoose.connection.db.dropDatabase()
}

const connectDB = async () => {
  return mongoose.connect(global.__MONGO_URI__, {
    ...mongooseOpts,
    dbName: global.__MONGO_DB_NAME__
  })
}

const disconnectDB = async () => {
  return mongoose.disconnect()
}

/*
mongoose.connection.on('open', () => {
  console.log('BIRRRRL connection with mongo')
})
*/

module.exports = {
  populateDB,
  disconnectDB,
  connectDB,
  clearDB
}
