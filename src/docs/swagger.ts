import swaggerAutogen from 'swagger-autogen'

import 'dotenv/config'
import { HOST, PORT } from 'src/config'
import { ResponseCodes } from 'src/utils/responses/codes'
import { formatJsonResponse } from 'src/utils/responses/responses'
import { EventDoc, EventMetaDoc } from './api/event.doc'
import { IncidentDoc, IncidentMetaDoc } from './api/incident.doc'
import { MonitorDoc, MonitorMetaDoc } from './api/monitor.doc'

const host = HOST !== '0.0.0.0' ? HOST : 'localhost'
const outputFile = 'src/docs/swagger_output.json'
const endpointsFiles = ['src/router/index.ts']

swaggerAutogen({ openapi: '3.0.0' })
const doc = {
  info: {
    version: '0.1.0',
    title: 'Monitor Engine API',
    description: 'Documentation automatically generated by the <b>swagger-autogen</b> module.'
  },
  host: `${host}:${PORT}`,
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Local server'
    }
  ],

  tags: [
    {
      name: 'General',
      description: 'Endpoints for general API functionality'
    },
    {
      name: 'Monitor',
      description: 'Endpoints for monitoring websites'
    },
    {
      name: 'Incidents',
      description: 'Managing incidents via the REST Api'
    },
    {
      name: 'Events',
      description: 'Endpoints for viewing events'
    }
  ],

  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Token used to authenticate with network.'
    }
  },

  definitions: {
    MonitorDoc: MonitorDoc,
    MonitorMetaDoc: MonitorMetaDoc,
    IncidentDoc: IncidentDoc,
    IncidentMetaDoc: IncidentMetaDoc,
    EventDoc: EventDoc,
    EventMetaDoc: EventMetaDoc
  } as any
}

const generateResponseDocs = () => {
  const codes = ResponseCodes

  for (const codeStr of Object.keys(codes)) {
    const code = parseInt(codeStr)
    if (code > 299) {
      doc.definitions[`Error${code}`] = formatJsonResponse(code, 'Example message')
    } else {
      doc.definitions[`Success${code}`] = formatJsonResponse(code, 'Example message')
    }
  }
}

export const initializeSwagger = async () => {
  generateResponseDocs()
  return await swaggerAutogen()(outputFile, endpointsFiles, doc)
}
