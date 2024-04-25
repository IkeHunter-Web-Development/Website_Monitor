import type { NextFunction, Request, Response } from 'express'
import { eventSearch } from 'src/controllers/eventActions'
import { Responses, sendError } from 'src/utils'
import { serializeEvents } from 'src/utils/serializers/eventSerializer'

export const queryEventsView = async (req: Request, res: Response, next: NextFunction) => {
  /* ====================== *
  #swagger.summary = 'Query Events'
  #swagger.tags = ['Events']
  #swagger.description = 'Search events by project id or monitor id.'
  
  #swagger.parameters['monitorId'] = {
    in: "query",
    description: "Monitor id to search events",
    type: "string"
  }
  #swagger.parameters['projectId'] = {
    in: "query",
    description: "Project id to search events",
    type: "string"
  }
  
  #swagger.responses[200] = { 
    "description": "Events Found",
    "schema": { $ref: "#/definitions/IncidentMetaDoc" }  
  }
  ** ====================== */
  try {
    const { monitorId, projectId } = req.query

    const events = await eventSearch({
      monitorId: monitorId?.toString(),
      projectId: projectId?.toString()
    })
    const serialized = await serializeEvents(events)

    return Responses.ok(res, serialized)
  } catch (error) {
    return sendError(error, res, next)
  }
}
