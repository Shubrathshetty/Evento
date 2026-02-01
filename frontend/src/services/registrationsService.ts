/**
 * Registrations Service - FastAPI Backend
 */
import { api } from '@/lib/api';
import type { Registration, RegistrationListResponse } from '@/types/api';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';

class RegistrationsService {
  async getAllRegistrations(): Promise<Registration[]> {
    const response = await api.get<RegistrationListResponse>('/api/admin/registrations');
    return response.registrations;
  }

  async getRegistrationById(id: string): Promise<Registration | null> {
    try {
      // This endpoint doesn't exist yet - use list and filter
      const all = await this.getAllRegistrations();
      return all.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error fetching registration:', error);
      return null;
    }
  }

  async getRegistrationsByEvent(eventId: string): Promise<Registration[]> {
    const response = await api.get<RegistrationListResponse>(
      `/api/events/${eventId}/registrations`
    );
    return response.registrations;
  }

  async getRegistrationsByUser(userId: string): Promise<Registration[]> {
    const response = await api.get<RegistrationListResponse>(
      `/api/users/${userId}/registrations`
    );
    return response.registrations;
  }

  async getMyRegistrations(): Promise<Registration[]> {
    const response = await api.get<RegistrationListResponse>('/api/users/me/registrations');
    return response.registrations;
  }

  async registerForEvent(eventId: string): Promise<Registration> {
    return await api.post<Registration>(`/api/events/${eventId}/register`, {});
  }

  async isUserRegistered(eventId: string): Promise<boolean> {
    try {
      const registrations = await this.getMyRegistrations();
      return registrations.some(r => r.event_id === eventId && r.status !== 'cancelled');
    } catch {
      return false;
    }
  }

  async updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<Registration> {
    return await api.put<Registration>(`/api/registrations/${id}/status`, { status });
  }

  async cancelRegistration(registrationId: string): Promise<void> {
    await api.delete(`/api/registrations/${registrationId}`);
  }
}

export const registrationsService = new RegistrationsService();
export type { Registration };
