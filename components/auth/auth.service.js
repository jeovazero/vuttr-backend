const KoaRouter = require('koa-router')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const router = new KoaRouter()
const Joi = require('joi')
const {
  UserPayloadSchema,
  UserCredentialsSchema
} = require('../user/user.schema')
const { TokenManagment } = require('../../utils')

router.post('/', async ctx => {
  try {
    const credentials = ctx.request.body
    const { error } = Joi.validate(credentials, UserCredentialsSchema, {
      convert: false
    })
    if (error) ctx.throw(400, error.details[0].message)

    const { email, password } = credentials
    const user = await User.findOne({ email })
    if (!user) ctx.throw(401, 'Wrong email or password')
    const isCreateToken = await user.comparePassword(password)
    if (!isCreateToken) ctx.throw(401, 'Wrong email or password')

    const token = await TokenManagment.create(email, user._id)

    ctx.body = {
      token
    }
    ctx.status = 200
  } catch (error) {
    // internal server erro? ====>
    ctx.throw(400, error.message)
  }
})

router.delete('/', async ctx => {
  try {
    // console.log({ ctx })
    const authorization = ctx.headers.authorization || ''
    // console.log({ authorization })
    if (!authorization) ctx.throw(401, 'Missing Authorization Header')

    const authParts = authorization.split(' ')
    const [type = '', token = null] = authParts
    if (type !== 'JWT') ctx.throw(401, 'Wrong Authorization Header')
    if (!token) ctx.throw(401, 'Missing token')

    await TokenManagment.remove(token)

    ctx.body = {}
    ctx.status = 200
  } catch (error) {
    ctx.throw(500, 'Internal Server Error')
  }
})

router.post('/register', async ctx => {
  try {
    const userPayload = ctx.request.body

    const { error } = Joi.validate(userPayload, UserPayloadSchema, {
      convert: false
    })
    if (error) throw new Error(error.details[0].message)

    const email = userPayload.email
    const userFound = await User.findOne({ email })
    if (userFound) throw new Error('User already registered')

    const newUser = new User(userPayload)
    await newUser.setHashPasswordAndSave()

    ctx.status = 201
    ctx.body = {}
  } catch (error) {
    ctx.throw(400, error.message)
  }
})

module.exports = router
