const app = require('../app')
const Joi = require('joi')
const agent = require('supertest').agent(app.callback())

const { ListToolSchema } = require('../schema')
const {
  connectDB,
  disconnectDB,
  clearDB,
  populateDB
} = require('../utils/tests/mongooseHelper')

describe('[GET] /tools{?tag}', () => {
  beforeAll(connectDB)
  beforeEach(clearDB)
  afterAll(disconnectDB)

  it('should retrieve all tools', async () => {
    await populateDB()

    const { body: listTools } = await agent
      .get('/tools')
      .expect('Content-type', /json/)
      .expect(200)

    const { error } = Joi.validate(listTools, ListToolSchema)
    expect(error).toBeNull()

    expect(listTools.length).toBe(3)

    expect(listTools[0].id).toBe(1)
    expect(listTools[1].id).toBe(2)
    expect(listTools[2].id).toBe(3)
  })

  it("should retrieve all tools with tag 'node'", async () => {
    await populateDB()

    const { body: listTools } = await agent
      .get('/tools')
      .query({ tag: 'node' })
      .expect('Content-type', /json/)
      .expect(200)

    const { error } = Joi.validate(listTools, ListToolSchema)

    expect(error).toBeNull()
    expect(listTools.length).toBe(2)

    listTools.forEach(({ tags }) => {
      expect(tags.includes('node')).toBe(true)
    })
  })
})
