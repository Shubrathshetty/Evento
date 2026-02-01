/**
 * Events Service - FastAPI Backend
 */
import { api } from '@/lib/api';
import type { Event, EventCreate, EventUpdate, EventListResponse } from '@/types/api';

class EventsService {
  async getAllEvents(page = 1, pageSize = 20): Promise<Event[]> {
    const response = await api.get<EventListResponse>(
      `/api/events?page=${page}&page_size=${pageSize}`
    );
    return response.events;
  }

  async getEventById(id: string): Promise<Event | null> {
    try {
      return await api.get<Event>(`/api/events/${id}`);
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    const response = await api.get<EventListResponse>(
      `/api/events?category=${encodeURIComponent(category)}`
    );
    return response.events;
  }

  async getFeaturedEvents(): Promise<Event[]> {
    // Get recent events as "featured"
    const response = await api.get<EventListResponse>('/api/events?page_size=6');
    return response.events;
  }

  async createEvent(eventData: EventCreate): Promise<Event> {
    return await api.post<Event>('/api/events', eventData);
  }

  async updateEvent(id: string, updates: EventUpdate): Promise<Event> {
    return await api.put<Event>(`/api/events/${id}`, updates);
  }

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/api/events/${id}`);
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    // FastAPI doesn't have this endpoint yet, return empty for now
    console.log('getEventsByOrganizer not implemented for:', organizerId);
    return [];
  }

  async searchEvents(query: string): Promise<Event[]> {
    const response = await api.get<EventListResponse>(
      `/api/events/search?q=${encodeURIComponent(query)}`
    );
    return response.events;
  }

  // Admin Methods

  async getAdminEvents(page = 1, pageSize = 20, status?: string): Promise<{ events: Event[], total: number }> {
    let url = `/api/admin/events?page=${page}&per_page=${pageSize}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await api.get<EventListResponse>(url);
    return { events: response.events, total: response.total };
  }

  async publishEvent(id: string, isPublished: boolean): Promise<Event> {
    return await api.patch<Event>(`/api/events/${id}/publish?is_published=${isPublished}`, {});
  }
}

export const eventsService = new EventsService();
export type { Event };
