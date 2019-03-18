const NodeEnv = require('jest-environment-node')
const { MongoMemoryServer } = require('mongodb-memory-server')

class MongoDbEnvironment extends NodeEnv {
  constructor (config) {
    super(config)
    this.mongod = new MongoMemoryServer()
  }

  async setup () {
    await super.setup()

    this.global.__MONGO_URI__ = await this.mongod.getConnectionString()
    this.global.__MONGO_DB_NAME__ = await this.mongod.getDbName()
  }

  async teardown () {
    await super.teardown()
    await this.mongod.stop()
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = MongoDbEnvironment
