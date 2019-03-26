// Helpers
const { mongooseTestHelper } = require('./helpers')
const { connectDB, clearDB, disconnectDB } = mongooseTestHelper

// Creating agent
const app = require('./app')
const supertest = require('supertest')
const agent = supertest.agent(app.callback())

beforeAll(connectDB)
beforeEach(clearDB)
afterAll(disconnectDB)

describe('[APP]', () => {
  it('should register user and add tools to your collection', async done => {
    const joaoLogin = {
      email: 'joaoarmless@mail.com',
      password: 'nicetomeetyou'
    }

    const joaoPayload = {
      ...joaoLogin,
      name: 'joao armless'
    }

    const tool1 = {
      description: 'desc1',
      title: 'tool1',
      tags: ['tag1', 'tag2'],
      link: 'https://tool1.com'
    }

    const tool2 = {
      ...tool1,
      tags: ['tag1', 'tag3']
    }

    const { status: statusRegister } = await agent
      .post('/api/v1/auth/register')
      .send(joaoPayload)

    expect(statusRegister).toBe(201)

    const { status: statusLogin, body: auth } = await agent
      .post('/api/v1/auth')
      .send(joaoLogin)
    expect(statusLogin).toBe(200)

    const { token } = auth
    expect(token.split('.').length).toBe(3)

    const { status: statusTool1 } = await agent
      .post('/api/v1/tools')
      .set({
        Authorization: 'JWT ' + token
      })
      .send(tool1)

    expect(statusTool1).toBe(200)

    const { status: statusTool2 } = await agent
      .post('/api/v1/tools')
      .set({
        Authorization: 'JWT ' + token
      })
      .send(tool2)
    expect(statusTool2).toBe(200)

    const { body: listTools } = await agent.get('/api/v1/tools').set({
      Authorization: 'JWT ' + token
    })

    expect(listTools.length).toBe(2)
    expect(listTools[0].id).toBe(1)
    expect(listTools[1].id).toBe(2)

    done()
  })
})
