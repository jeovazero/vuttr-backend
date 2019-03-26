const mongoose = require('mongoose')
const Tool = require('./Tool.js')

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  tools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }],
  hashPassword: String
})

/* TO DO */
UserSchema.methods.comparePassword = function (password, callback) {
  return this.hashPassword === password
}

/**
 *  Find a user by email and add a tool to your collection
 *  @param {string} email - User email
 *  @param {object} tool - Tool object
 *  @returns {object} Tool added
 * */
UserSchema.statics.findByEmailAndAddTool = async function (email, tool) {
  const user = await this.findOne({ email })
  const newTool = new Tool({ ...tool, owner: user._id })
  const savedTool = await newTool.save()
  const id = savedTool._id
  if (user.tools.indexOf(id) === -1) {
    user.tools.push(id)
  }
  await user.save()
  return savedTool
}

/**
 *  Find a user by email and remove a tool to your collection
 *  @param {string} email - User email
 *  @param {object} tool - Tool id
 *  @returns {boolean} True for success
 * */

UserSchema.statics.findByEmailAndRemoveTool = async function (email, toolId) {
  const user = await this.findOne({ email })
  const tool = Tool.findOne({ id: toolId })
  user.tools.remove(tool._id)
  const { deletedCount } = await Tool.deleteOne({ id: toolId })
  await user.save()
  return deletedCount === 1
}

/**
 *  Find a user by email and returns all tools from your collection
 *  @param {string} email - User email
 *  @returns {object} User tools
 * */
UserSchema.statics.findByEmailAndGetTools = async function (email) {
  const user = await this.findOne({ email }).populate(
    'tools',
    '-_id -owner -__v'
  )
  return user.tools
}

module.exports = mongoose.model('User', UserSchema)
