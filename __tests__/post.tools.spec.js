const app = require('../app')
const Joi = require('joi')
const agent = require('supertest').agent(app.callback())

const { ToolSchema } = require('../schema')
const {
  connectDB,
  clearDB,
  disconnectDB
} = require('../utils/tests/mongooseHelper')

describe('[POST] /tools', () => {
  beforeAll(connectDB)
  beforeEach(clearDB)
  afterAll(disconnectDB)

  it('should create a tool', async () => {
    const payload = {
      title: 'prettier',
      description: 'Formats your code',
      tags: ['formater', 'node'],
      link: 'http://prettier.io'
    }

    const { body: prettier } = await agent
      .post('/tools')
      .send(payload)
      .expect('Content-type', /json/)
      .expect(200)

    const { error } = Joi.validate(prettier, ToolSchema)
    expect(error).toBeNull()

    expect(prettier.title).toBe('prettier')
    expect(prettier.id).toBe(1)
  })
})
