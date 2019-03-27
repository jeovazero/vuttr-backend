// Helpers
const { appHelper, mongooseTestHelper } = require('../../helpers')
const { connectDB, populateDB, clearDB, disconnectDB } = mongooseTestHelper

// Mongoose
const mongoose = require('mongoose')
require('../../models/User')

// Creating app
const toolsService = require('./tools.service')
const app = appHelper.app.use(toolsService.routes())

// Creating agent
const supertest = require('supertest')
const agent = supertest.agent(app.callback())

const { ListToolSchema, ToolSchema } = require('./tools.schema')
const Joi = require('joi')

describe('/tools', () => {
  describe(`[GET] {?tag}`, () => {
    beforeAll(connectDB)
    beforeEach(clearDB)
    afterAll(disconnectDB)

    it('should retrieve all tools', async () => {
      await populateDB()

      const { body: listTools } = await agent
        .get('/')
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
        .get('/')
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

  describe(`[DELETE] /id`, () => {
    beforeAll(connectDB)
    beforeEach(clearDB)
    afterAll(async done => {
      await disconnectDB()
      done()
    })

    it('should delete the tool of id=1', async () => {
      await populateDB()

      const { body } = await agent
        .delete('/1')
        .expect('Content-type', /json/)
        .expect(200)

      expect(Object.keys(body).length).toBe(0)

      const Tool = mongoose.model('Tool')
      const remaining = await Tool.find().sort({ id: 1 })

      expect(remaining.length).toBe(2)
      expect(remaining[0].id).toBe(2)
      expect(remaining[1].id).toBe(3)
    })

    it('should try delete a nonexistent tool', async () => {
      await populateDB()

      const { status } = await agent.delete('/tools/99').catch(err => {
        return err.response
      })

      expect(status).toBe(404)

      const Tool = mongoose.model('Tool')
      const remaining = await Tool.find().sort({ id: 1 })

      expect(remaining.length).toBe(3)
      expect(remaining[0].id).toBe(1)
      expect(remaining[1].id).toBe(2)
      expect(remaining[2].id).toBe(3)
    })
  })

  describe(`[POST]`, () => {
    beforeAll(connectDB)
    beforeEach(clearDB)
    afterAll(disconnectDB)

    it('should create a tool', async () => {
      await populateDB()

      const payload = {
        title: 'prettier',
        description: 'Formats your code',
        tags: ['formater', 'node'],
        link: 'http://prettier.io'
      }

      const { body: prettier } = await agent
        .post('/')
        .send(payload)
        .expect('Content-type', /json/)
        .expect(200)

      const { error } = Joi.validate(prettier, ToolSchema)
      expect(error).toBeNull()

      expect(prettier.title).toBe('prettier')
      expect(prettier.id).toBe(4)
    })

    it('should try create an invalid tool', async () => {
      await populateDB()

      const payload = {
        title: ['fdfsdf'],
        description: 'Formats your code',
        tags: ['formater', 'node'],
        link: 'http://prettier.io'
      }

      const { status } = await agent
        .post('/')
        .send(payload)
        .catch(err => {
          return err.response
        })

      expect(status).toBe(400)
    })
  })
})
