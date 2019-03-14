const Joi = require('joi')

const ToolPayloadSchema = Joi.object().keys({
  title: Joi.string().required(),
  link: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
})

const ToolSchema = ToolPayloadSchema.append({
  id: Joi.number()
})

const ListToolSchema = Joi.array().items(ToolSchema)

module.exports = {
  ToolPayloadSchema,
  ToolSchema,
  ListToolSchema
}
