const mongoose = require('mongoose')

const Counter = new mongoose.Schema({
  id: { type: String },
  sequence: { type: Number, default: 1 }
})
Counter.index({ id: 1 })
const counter = mongoose.model('counter', Counter)

const mongooseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  link: String,
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

mongooseSchema.pre('save', async function (next) {
  try {
    const current = this
    const countTool = await counter.findOneAndUpdate(
      { id: 'toolId' },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    )
    current.id = countTool.sequence
    await next()
  } catch (e) {
    console.log({ global: global.__MONGO_DB_NAME__ })
    console.log('PRESAVE', e)
  }
})

module.exports = mongoose.model('Tool', mongooseSchema)
