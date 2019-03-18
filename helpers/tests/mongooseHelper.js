const mongoose = require('mongoose')
const Tool = require('../../models/Tool')

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
  await Promise.all(
    fakeTools.map(tool => {
      const record = new Tool(tool)
      return record.save()
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
