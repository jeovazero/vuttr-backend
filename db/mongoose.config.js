module.exports = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  promiseLibrary: Promise,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
}
