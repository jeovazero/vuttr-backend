const Joi = require('joi')

const UserCredentialsSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
})

const UserPayloadSchema = UserCredentialsSchema.append({
  name: Joi.string().required()
})

module.exports = {
  UserCredentialsSchema,
  UserPayloadSchema
}
