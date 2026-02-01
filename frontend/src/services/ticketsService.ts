import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type Ticket = Database['public']['Tables']['tickets']['Row']
type TicketInsert = Database['public']['Tables']['tickets']['Insert']
type TicketUpdate = Database['public']['Tables']['tickets']['Update']

class TicketsService {
  async getAllTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        registrations (
          id,
          status,
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
        )
      `)
      .order('issued_at', { ascending: false })

    if (error) {
      console.error('Error fetching tickets:', error)
      throw error
    }

    return data || []
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        registrations (
          id,
          status,
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
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching ticket:', error)
      return null
    }

    return data
  }

  async getTicketsByRegistration(registrationId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('registration_id', registrationId)
      .order('issued_at', { ascending: false })

    if (error) {
      console.error('Error fetching tickets by registration:', error)
      throw error
    }

    return data || []
  }

  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        registrations!inner (
          id,
          events (
            id,
            title,
            date,
            location
          )
        )
      `)
      .eq('registrations.user_id', userId)
      .order('issued_at', { ascending: false })

    if (error) {
      console.error('Error fetching tickets by user:', error)
      throw error
    }

    return data || []
  }

  async issueTicket(registrationId: string): Promise<Ticket> {
    // Generate a unique ticket number
    const ticketNumber = this.generateTicketNumber()

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        registration_id: registrationId,
        ticket_number: ticketNumber
      })
      .select()
      .single()

    if (error) {
      console.error('Error issuing ticket:', error)
      throw error
    }

    return data
  }

  async updateTicket(id: string, updates: TicketUpdate): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating ticket:', error)
      throw error
    }

    return data
  }

  async deleteTicket(id: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting ticket:', error)
      throw error
    }
  }

  async validateTicket(ticketCode: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        registrations (
          id,
          status,
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
        )
      `)
      .eq('ticket_code', ticketCode)
      .single()

    if (error) {
      console.error('Error validating ticket:', error)
      return null
    }

    return data
  }

  private generateTicketCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

export const ticketsService = new TicketsService()
export type { Ticket }
