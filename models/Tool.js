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
  tags: [String]
})

mongooseSchema.pre('save', function (next) {
  const current = this
  counter
    .findOneAndUpdate(
      { id: 'toolId' },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    )
    .then(countTool => {
      // console.log('INSERTED')
      current.id = countTool.sequence
      next()
    })
    .catch(e => {
      console.log(e)
    })
})

module.exports = mongoose.model('Tool', mongooseSchema)
