/**
 * @fileoverview API controller for the monitor objects.
 */
import { Request, Response } from "express";
import { simpleResponse } from "../utils/responses";
import { MonitorService } from "src/services";

export class MonitorController {
  constructor() {}

  static createMonitor = async (req: Request, res: Response) => {
    /**======================*
      @swagger Create monitor
      #swagger.parameters['body'] = {
        in: "body",
        name: "body",
        description: "Monitor object",
        required: true,
        schema: {$ref: "#/definitions/MonitorBody"}
      }
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for creating a monitor.'
      #swagger.responses[201] = {
        schema: { $ref: "#/definitions/MonitorResponse" },
        description: "Monitor created"
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
     *========================*/

    return MonitorService.createMonitor(req.body)
      .then((monitor: any) => {
        return res.status(201).json(monitor);
      })
      .catch((err: any) => {
        console.log(err);
        return simpleResponse(res, 500, err.message);
      });
  };

  static async updateMonitor(req: Request, res: Response) {
    /**======================*
      @swagger Update monitor
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for updating a monitor.'
      #swagger.parameters['id'] = { description: 'Monitor ID' }
      #swagger.parameters['body'] = {
        in: "body",
        name: "body",
        description: "Monitor object",
        required: true,
        schema: {$ref: "#/definitions/MonitorBody"}
      }
      #swagger.responses[200] = {
          schema: { $ref: "#/definitions/MonitorResponse" },
          description: "Monitor updated"
      }
  
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
      
      #swagger.responses[404] = {
        schema: {$ref: "#/definitions/Error404"},
      }
     *=======================*/
    const { id } = req.params || "";

    return MonitorService.updateMonitor(id, req.body)
      .then((monitor: any) => {
        if (!monitor) {
          return simpleResponse(res, 404, "Monitor not found");
        }
        return res.status(200).json(monitor);
      })
      .catch((err: any) => {
        console.log(err);
        return simpleResponse(res, 500, err.message);
      });
  }

  static async getMonitor(req: Request, res: Response) {
    /**==========================*
      @swagger Get single monitor
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for getting a single monitor.'
      #swagger.parameters['id'] = { description: 'Monitor ID' }
      #swagger.responses[200] = {
            schema: { $ref: "#/definitions/MonitorResponse" },
            description: "Monitor updated"
        }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
      #swagger.responses[404] = {
        schema: {$ref: "#/definitions/Error404"},
      }
     *===========================*/
    const { id } = req.params || "";

    return MonitorService.getMonitor(id)
      .then((monitor: any) => {
        if (!monitor) {
          return simpleResponse(res, 404, "Monitor not found");
        }
        return res.status(200).json(monitor);
      })
      .catch((err: any) => {
        console.log(err);
        return simpleResponse(res, 500, err.message);
      });
  }

  static deleteMonitor = async (req: Request, res: Response) => {
    /**==========================*
      @swagger Delete single monitor
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for deleting a single monitor.'
      #swagger.parameters['id'] = { description: 'Monitor ID' }
      #swagger.responses[200] = {
        description: "Monitor deleted successfully",
        schema: { 
          status: 200,
          message: "Monitor deleted"
        }
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
      #swagger.responses[404] = {
        schema: {$ref: "#/definitions/Error404"},
      }
     *===========================*/
    const { id } = req.params || "";
    const monitor = await MonitorService.getMonitor(id);

    if (!monitor) return simpleResponse(res, 404, "Monitor not found");

    return MonitorService.deleteMonitor(id)
      .then((success) => {
        if (!success) {
          return simpleResponse(res, 404, "Monitor not found");
        }
        return simpleResponse(res, 200, "Monitor deleted");
      })
      .catch((err: any) => {
        console.log(err);
        return simpleResponse(res, 500, err.message);
      });
  };

  static async getMonitors(_: Request, res: Response) {
    /**==========================*
      @swagger Get all monitors
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for getting all monitors.'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.responses[200] = {
        description: "Success",
        schema: [{$ref: "#/definitions/MonitorResponse"}],
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
     *===========================*/
    return MonitorService.getMonitors()
      .then((monitors: any) => {
        return res.status(200).json(monitors);
      })
      .catch((err: any) => {
        return simpleResponse(res, 500, err.message);
      });
  }

  static async searchMonitors(req: Request, res: Response) {
    /**================================*
      @swagger Search monitors by query
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for searching monitors.'
      #swagger.parameters['project'] = { description: 'Project ID' }
      #swagger.parameters['user'] = { description: 'User ID' }
      #swagger.responses[200] = {
        description: "Success",
        schema: [{$ref: "#/definitions/MonitorResponse"}],
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
      #swagger.responses[404] = {
        schema: {$ref: "#/definitions/Error404"},
      }
     *=================================*/
    const params = req.query || {};

    return MonitorService.searchMonitors(params)
      .then((monitors: any) => {
        if (!monitors)
          return res.status(404).json({
            status: 404,
            message: "No monitors found",
          });
        return res.status(200).json(monitors);
      })
      .catch((err: any) => {
        console.log(err);
        return simpleResponse(res, 500, err.message);
      });
  }

  static async getMonitorOnlineStatus(req: Request, res: Response) {
    /**=================================*
      @swagger Get monitor online status
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for getting online status for monitor.'
      #swagger.parameters['id'] = { description: 'Monitor ID' }
      #swagger.responses[200] = {
        description: "True if online, false if offline",
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
      #swagger.responses[404] = {
        schema: {$ref: "#/definitions/Error404"},
      }
     *==================================*/
    const { id } = req.params || "";

    let monitor = await MonitorService.getMonitor(id);

    if (!monitor) {
      return simpleResponse(res, 404, "Monitor not found");
    }

    if (!monitor.online) {
      return res.status(200).send(false);
    } else {
      return res.status(200).send(true);
    }
  }

  static async alertMonitor(req: Request, res: Response) {
    /**=================================*
      @swagger Alert monitor down
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for alerting service that a monitor is down.'
      #swagger.parameters['body'] = {
        in: "body",
        name: "body",
        description: "Alert payload",
        required: true,
        schema: {
          id: "monitor-id",
          statusCode: 500,
          error: "Website experienced an internal server error",
        }
      }
      #swagger.responses[200] = {
        description: "Alert received",
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
      #swagger.responses[404] = {
        schema: {$ref: "#/definitions/Error404"},
      }
     *==================================*/
    const { id, statusCode, stable, message } = req.body;

    let monitor = await MonitorService.getMonitor(id);

    if (!monitor) {
      return simpleResponse(res, 404, "Monitor not found");
    }

    if (stable === true) {
      let success = MonitorService.handleMonitorBackOnline(monitor, statusCode);

      if (!success) {
        return simpleResponse(res, 500, "Error handling monitor back online");
      }
    } else {
      let success = MonitorService.handleMonitorDown(monitor, statusCode, message);

      if (!success) {
        return simpleResponse(res, 500, "Error handling monitor down");
      }
    }

    return res.status(200).send("Alert received");
  }

  static async getDetailedMonitors(_: Request, res: Response) {
    /**==========================*
      @swagger Get all monitor details
      #swagger.tags = ['Monitor']
      #swagger.description = 'Endpoint for getting details for all monitors.'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.responses[200] = {
        description: "Success",
        schema: [{$ref: "#/definitions/MonitorResponseDetailed"}],
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"},
      }
     *===========================*/
    const token = res.locals.token || "";
    const monitors = await MonitorService.getDetailedMonitors(token).catch((err) => {
      return res.status(500).json(err.message);
    });

    return res.status(200).json(monitors);
  }
}
