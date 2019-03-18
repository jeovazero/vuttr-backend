const app = require('../app')
const agent = require('supertest').agent(app.callback())
const mongoose = require('mongoose')
const {
  populateDB,
  connectDB,
  clearDB,
  disconnectDB
} = require('../helpers/tests/mongooseHelper')

const BASE_URL = '/api/v1/tools'

describe(`[DELETE] ${BASE_URL}/id`, () => {
  beforeAll(connectDB)
  beforeEach(clearDB)
  afterAll(disconnectDB)

  it('should delete the tool of id=1', async () => {
    await populateDB()

    const { body } = await agent
      .delete(`${BASE_URL}/1`)
      .expect('Content-type', /json/)
      .expect(200)

    expect(Object.keys(body).length).toBe(0)

    const Tool = mongoose.model('Tool')
    const remaining = await Tool.find().sort({ id: 1 })

    expect(remaining.length).toBe(2)
    expect(remaining[0].id).toBe(2)
    expect(remaining[1].id).toBe(3)
  })
})
