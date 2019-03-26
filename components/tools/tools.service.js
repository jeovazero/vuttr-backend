const KoaRouter = require('koa-router')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const router = new KoaRouter()
const Joi = require('joi')
const { ToolPayloadSchema } = require('./tools.schema.js')

const IS_TEST = process.env.NODE_ENV === 'test'

const getEmail = ctx => {
  if (IS_TEST) {
    return 'joaoarms@mail.com'
  } else {
    return ctx.state.user.email
  }
}

router.get('/', async ctx => {
  try {
    const tag = ctx.query.tag || ''
    const email = getEmail(ctx)
    const tools = await User.findByEmailAndGetTools(email)

    if (tag.length > 0) {
      ctx.body = tools.filter(el => {
        return el.tags.includes(tag)
      })
    } else {
      ctx.body = tools
    }
  } catch (error) {
    ctx.throw(500, 'Internal Server Error')
  }
})

router.post('/', async ctx => {
  try {
    const tool = ctx.request.body
    const email = getEmail(ctx)

    const { error } = Joi.validate(tool, ToolPayloadSchema, { convert: false })
    if (error) throw Error(error.details[0].message)

    const savedTool = await User.findByEmailAndAddTool(email, tool)
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
    const email = getEmail(ctx)

    const success = await User.findByEmailAndRemoveTool(email, id)
    if (!success) throw new Error('Tool not found')
    ctx.body = {}
  } catch (error) {
    ctx.throw(404, error.message)
  }
})

module.exports = router
