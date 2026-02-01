// Legacy compatibility layer for components still using the old events.ts interface
// This file now delegates to the FastAPI-based eventsService

import { eventsService, type Event } from '@/services/eventsService'

// Re-export the Event type for backward compatibility
export type { Event }

// Legacy functions for backward compatibility - these now use FastAPI
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    return await eventsService.getEventById(id)
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export const getFeaturedEvents = async (): Promise<Event[]> => {
  try {
    const events = await eventsService.getAllEvents()
    // For now, we'll consider events created in the last 30 days as "featured"
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return events.filter(event => new Date(event.created_at) > thirtyDaysAgo)
  } catch (error) {
    console.error('Error fetching featured events:', error)
    return []
  }
}

export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  try {
    const events = await eventsService.getAllEvents()
    return events.filter(event => event.category === category)
  } catch (error) {
    console.error('Error fetching events by category:', error)
    return []
  }
}

// Keep the old events array for any components that might still reference it directly
// This will be populated asynchronously
export let events: Event[] = []

// Initialize events on module load
eventsService.getAllEvents().then(fetchedEvents => {
  events = fetchedEvents
}).catch(error => {
  console.error('Error initializing events:', error)
})
