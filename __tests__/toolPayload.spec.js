const { ToolPayloadSchema } = require('../schema')
const Joi = require('joi')

describe('Tool Payload Schema', () => {
  it('Should be a CORRECT payload', () => {
    const correctTool = {
      title: 'fastify',
      link: 'https://www.fastify.io/',
      description:
        'Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.',
      tags: ['web', 'framework', 'node', 'http2', 'https', 'localhost']
    }

    const { error } = Joi.validate(correctTool, ToolPayloadSchema)
    expect(error).toBeNull()
  })

  it('Should be a INCORRECT payload', () => {
    const incorrectTool = {
      title: 'fastify',
      link: 'https://www.fastify.io/',
      description:
        'Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.',
      tags: [7, 1]
    }

    const { error } = Joi.validate(incorrectTool, ToolPayloadSchema)
    expect(error).not.toBeNull()
  })
})
