const KoaRouter = require('koa-router')
const mongoose = require('mongoose')
const Tool = mongoose.model('Tool')
const router = new KoaRouter()

router.get('/', async ctx => {
  const tag = ctx.query.tag || ''
  const tools = await Tool.find({}, { _id: 0, __v: 0 }).sort({ id: 1 })

  if (tag.length > 0) {
    ctx.body = tools.filter(el => {
      return el.tags.includes(tag)
    })
  } else {
    ctx.body = tools
  }
})

router.post('/', async ctx => {
  const tool = ctx.request.body
  const newTool = new Tool(tool)
  const savedTool = await newTool.save()
  ctx.body = {
    id: savedTool.id,
    title: savedTool.title,
    description: savedTool.description,
    tags: savedTool.tags,
    link: savedTool.link
  }
})

router.delete('/:id', async ctx => {
  const id = ctx.params.id || 0
  await Tool.deleteOne({ id })
  ctx.body = {}
})

module.exports = router
