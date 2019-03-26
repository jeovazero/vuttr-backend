const { TokenManagment } = require('../../utils')

const auth = async (ctx, next) => {
  try {
    const authorization = ctx.headers.authorization || ''
    if (!authorization) ctx.throw(401, 'Missing Authorization Header')

    const authParts = authorization.split(' ')
    const [type = '', token = null] = authParts
    if (type !== 'JWT') ctx.throw(401, 'Wrong Authorization Header')
    if (!token) ctx.throw(401, 'Missing token')

    const isAuthenticated = await TokenManagment.verify(token)
    if (!isAuthenticated) ctx.throw(401, 'User not authenticated')
    ctx.state.user = {
      email: isAuthenticated.email
    }
    next()
  } catch (error) {
    ctx.throw(401, error.message)
  }
}

module.exports = auth
