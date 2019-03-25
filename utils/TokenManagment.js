const redis = require('redis')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const { promisify } = require('util')
const SECRET = process.env.SECRET || 'huedf45~rt]rt.d435'
const EXPIRATION = process.env.EXPIRATION || 900 // 15min
const nanoid = require('nanoid')
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
const REDIS_PORT = process.env.REDIS_PORT || '6379'

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
})

const clientAsync = ['get', 'set', 'del', 'expire'].reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: promisify(client[cur]).bind(client)
  }),
  {}
)

client.on('connect', () => {
  console.log('Redis connected')
})

const getJwtid = token => {
  const parts = token.split('.')
  const payload = JSON.parse(base64url.decode(parts[1]))
  const jwtid = payload.jti
  return jwtid
}

const create = async (email, userId) => {
  const issuedAt = Date.now()
  const jwtid = `${userId}:${issuedAt}:${nanoid()}`
  const userKey = nanoid(32)
  const secret = SECRET + '~' + userKey
  const expiresIn = EXPIRATION
  const payload = {
    email
  }
  const token = jwt.sign(payload, secret, { expiresIn, jwtid })
  await clientAsync.set(jwtid, userKey)
  return token
}

const remove = async token => {
  const jwtid = getJwtid(token)
  await clientAsync.del(jwtid)
}

const verify = async token => {
  const jwtid = getJwtid(token)
  const userKey = await clientAsync.get(jwtid)
  const secret = SECRET + '~' + userKey
  return jwt.verify(token, secret)
}

module.exports = {
  create,
  remove,
  verify
}
