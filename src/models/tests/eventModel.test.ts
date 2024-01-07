/**
 * @fileoverview Tests for the Event model.
 */
import type { IEvent } from 'src/models'
import { Monitor, Event } from 'src/models'

describe('Event model CRUD data', () => {
  let monitor: Monitor
  let eventData: IEvent

  /**
   * Create a monitor before each test.
   */
  beforeEach(async () => {
    const payload = {
      projectId: '123',
      url: 'https://example.com',
      title: 'Example'
    }

    monitor = await Monitor.create(payload)

    eventData = {
      projectId: '123',
      message: 'Monitor is offline',
      monitorId: monitor._id
    }
  })

  it('should create an event model', async () => {
    await Event.create(eventData)

    const events = await Event.find({})
    expect(events.length).toEqual(1)
  })

  it('should update an event model', async () => {
    await Event.create(eventData)
    const newMessage = 'Monitor is online'

    const updatedEvent: Partial<IEvent> = {
      message: newMessage
    }

    await Event.updateOne(updatedEvent)

    const events: Array<Event> = await Event.find({})
    expect(events[0].message).toEqual(newMessage)
  })

  it('should get an event model', async () => {
    await Event.create(eventData)
    const events = await Event.find({})

    expect(events.length).toEqual(1)
  })

  it('should delete an event model', async () => {
    const event = await Event.create(eventData)

    await Event.deleteOne({ _id: event._id })

    const events = await Event.find({})
    expect(events.length).toEqual(0)
  })
})
