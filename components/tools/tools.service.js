const KoaRouter = require('koa-router')
const mongoose = require('mongoose')
const Tool = mongoose.model('Tool')
const router = new KoaRouter()
const Joi = require('joi')
const { ToolPayloadSchema } = require('./tools.schema.js')

router.get('/', async ctx => {
  const tag = ctx.query.tag || ''
  const tools = await Tool.find({}, { _id: 0, __v: 0, owner: 0 }).sort({
    id: 1
  })

  if (tag.length > 0) {
    ctx.body = tools.filter(el => {
      return el.tags.includes(tag)
    })
  } else {
    ctx.body = tools
  }
})

router.post('/', async ctx => {
  try {
    const tool = ctx.request.body

    const { error } = Joi.validate(tool, ToolPayloadSchema, { convert: false })
    if (error) throw Error(error.details[0].message)

    const newTool = new Tool(tool)
    const savedTool = await newTool.save()
    ctx.body = {
      id: savedTool.id,
      title: savedTool.title,
      description: savedTool.description,
      tags: savedTool.tags,
      link: savedTool.link
    }
  } catch (error) {
    ctx.throw(400, error.message)
  }
})

router.delete('/:id', async ctx => {
  try {
    const id = ctx.params.id || 0
    const { deletedCount } = await Tool.deleteOne({ id })
    if (deletedCount === 0) throw new Error('Tool not found')
    ctx.body = {}
  } catch (error) {
    ctx.throw(404, error.message)
  }
})

module.exports = router
