const Joi = require('joi')

const ToolPayloadSchema = Joi.object().keys({
  title: Joi.string().required(),
  link: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
})

module.exports = {
  ToolPayloadSchema
}
