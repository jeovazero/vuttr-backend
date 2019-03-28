// Helpers
const { appHelper, mongooseTestHelper } = require('../../helpers')
const { connectDB, populateDB, clearDB, disconnectDB } = mongooseTestHelper

// Mongoose
require('../../db')

// Creating app
const authService = require('./auth.service')
const authMiddleware = require('./auth.middleware')
appHelper.addMiddleware(authMiddleware)
const app = appHelper.app.use(authService.routes())
// Creating agent
const supertest = require('supertest')
const agent = supertest.agent(app.callback())

describe('/auth', () => {
  describe(`[POST] - Retrieves a token`, () => {
    beforeAll(connectDB)
    beforeEach(clearDB)
    afterAll(disconnectDB)

    it('should retrieves a token', async () => {
      await populateDB()

      const payload = {
        email: 'joaoarms@mail.com',
        password: 'huehue'
      }

      const { body: auth } = await agent
        .post('/')
        .send(payload)
        .expect(200)

      const { token } = auth
      expect(typeof token).toBe('string')
    })

    it('should receives a error with wrong email or password', async () => {
      await populateDB()

      const payload = {
        email: 'false@fma.com',
        password: 'p455w0rd'
      }

      const { status, text } = await agent
        .post('/')
        .send(payload)
        .catch(resp => {
          return resp.response
        })

      expect(status).toBe(400)
      expect(/wrong.+(email|password)/i.test(text)).toBe(true)
    })

    it('should receives a error with wrong payload schema', async () => {
      await populateDB()

      const payload = {
        mail: 'false@fma.com',
        pass: 'p455w0rd'
      }

      const { status, text } = await agent
        .post('/')
        .send(payload)
        .catch(resp => {
          return resp.response
        })

      expect(status).toBe(400)
      expect(/is required/.test(text)).toBe(true)
    })
  })

  describe('[DELETE] - Invalidate a token', () => {
    beforeAll(connectDB)
    beforeEach(clearDB)
    afterAll(disconnectDB)

    it('should invalidate a token', async () => {
      await populateDB()

      const payload = {
        email: 'joaoarms@mail.com',
        password: 'huehue'
      }

      const { body: auth } = await agent
        .post('/')
        .send(payload)
        .expect(200)

      const { token } = auth

      await agent
        .delete('/')
        .set({
          Authorization: 'JWT ' + token
        })
        .expect(200)
    })
  })
})

describe('/auth/register', () => {
  describe('[POST] - Create a new user', () => {
    beforeAll(connectDB)
    beforeEach(clearDB)
    afterAll(disconnectDB)

    it('should create a new user', async () => {
      const payload = {
        name: 'joao',
        email: 'joao2arms@mail.com',
        password: 'huehuehue'
      }

      const { body, status } = await agent.post('/register').send(payload)

      expect(status).toBe(201)
      expect(Object.keys(body).length).toBe(0)
    })

    it('should receives a error by create a user already existent', async () => {
      await populateDB()

      const payload = {
        name: 'joao',
        email: 'joaoarms@mail.com',
        password: 'huehue'
      }

      const { status } = await agent
        .post('/register')
        .send(payload)
        .catch(response => {
          return response.response
        })

      expect(status).toBe(400)
    })
  })
})

describe('[AUTH MIDDLEWARE]', () => {
  beforeAll(connectDB)
  beforeEach(clearDB)
  afterAll(disconnectDB)

  it('should autorizate with success', async () => {
    await populateDB()

    const payload = {
      email: 'joaoarms@mail.com',
      password: 'huehue'
    }

    const { body: auth } = await agent
      .post('/')
      .send(payload)
      .expect(200)

    const { token } = auth

    const { status, text } = await agent.post('/test').set({
      Authorization: 'JWT ' + token
    })
    expect(text).toBe('test')
    expect(status).toBe(200)
  })

  it('should not autorizate', async () => {
    await populateDB()

    const payload = {
      email: 'joaoarms@mail.com',
      password: 'huehue'
    }

    const { body: auth } = await agent
      .post('/')
      .send(payload)
      .expect(200)

    const { token } = auth
    const invalidToken = token.substr(1)
    const { status } = await agent
      .post('/test')
      .set({
        Authorization: 'JWT ' + invalidToken
      })
      .catch(resp => {
        return resp.response
      })

    expect(status).toBe(401)
  })
})
