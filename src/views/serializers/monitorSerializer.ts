import { getMonitorEvents } from 'src/controllers'
import { getMonitorResponses } from 'src/controllers/monitorController'
import type { WebsiteMonitor } from 'src/models'

export const serializeMonitor = async (monitor: WebsiteMonitor): Promise<IWebsiteMonitorMeta> => {
  const events = await getMonitorEvents(monitor)
  const responses = await getMonitorResponses(monitor)

  return {
    projectId: monitor.projectId,
    title: monitor.title,
    interval: monitor.interval,
    icon: monitor.icon,
    active: monitor.active,
    reminderIntervals: monitor.reminderIntervals,
    subscribers: monitor.subscribers.map((sub) => ({
      id: sub._id?.toString(),
      displayName: sub.displayName || '',
      email: sub.email,
      phone: sub.phone,
      method: sub.method,
      userId: sub.userId
    })),
    url: monitor.url,
    checkType: monitor.checkType,
    retries: monitor.retries,
    timeout: monitor.timeout,

    id: monitor._id.toString(),
    uuid: 'TODO',
    status: monitor.status,
    lastCheck: monitor.lastCheck.getTime(),
    createdAt: monitor.createdAt.getTime(),
    updatedAt: monitor.updatedAt.getTime(),
    events: events.map((event) => ({
      id: event._id.toString(),
      message: event.message,
      incidentId: event.incidentId?.toString(),
      timestamp: event.timestamp.getTime()
    })),
    responses: responses.map((res) => ({
      id: res._id.toString(),
      responseTime: res.responseTime,
      createdAt: res.createdAt.getTime()
    })),
    availability: monitor.availability,
    responseTime: monitor.responseTime
  }
}

export const serializeMonitors = async (
  monitors: WebsiteMonitor[]
): Promise<IWebsiteMonitorMeta[]> => {
  return await Promise.all(monitors.map((monitor) => serializeMonitor(monitor)))
}
