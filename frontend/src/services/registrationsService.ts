import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type Registration = Database['public']['Tables']['registrations']['Row']
type RegistrationInsert = Database['public']['Tables']['registrations']['Insert']
type RegistrationUpdate = Database['public']['Tables']['registrations']['Update']

export type RegistrationStatus = 'pending' | 'approved' | 'rejected'

class RegistrationsService {
  async getAllRegistrations(): Promise<Registration[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (
          id,
          title,
          date,
          location
        ),
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching registrations:', error)
      throw error
    }

    return data || []
  }

  async getRegistrationById(id: string): Promise<Registration | null> {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (
          id,
          title,
          date,
          location
        ),
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching registration:', error)
      return null
    }

    return data
  }

  async getRegistrationsByEvent(eventId: string): Promise<Registration[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching registrations by event:', error)
      throw error
    }

    return data || []
  }

  async getRegistrationsByUser(userId: string): Promise<Registration[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (
          id,
          title,
          date,
          location,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching registrations by user:', error)
      throw error
    }

    return data || []
  }

  async registerForEvent(eventId: string): Promise<Registration> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be authenticated to register for events')
    }

    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (existingRegistration) {
      throw new Error('User is already registered for this event')
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error registering for event:', error)
      throw error
    }

    return data
  }

  async isUserRegistered(eventId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking registration status:', error)
      throw error
    }

    return !!data
  }

  async updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<Registration> {
    const { data, error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating registration status:', error)
      throw error
    }

    return data
  }

  async cancelRegistration(id: string): Promise<void> {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error canceling registration:', error)
      throw error
    }
  }
}

export const registrationsService = new RegistrationsService()
export type { Registration }
