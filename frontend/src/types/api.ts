/**
 * API Types - TypeScript interfaces for FastAPI backend
 */

// User types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

// Event types
export interface Event {
    id: string;
    title: string;
    description: string | null;
    date: string;
    location: string | null;
    category: string | null;
    capacity: number | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    registration_count?: number;
    is_full?: boolean;
    // Backend now returns these fields
    image_url?: string;  // Maps to 'image' in frontend
    time?: string;       // Time of event (e.g., "7:00 PM")
    price?: number;      // Price in dollars
    attendees?: number;  // Alias for registration_count
    organizer?: string;  // Creator's name
}

// Map backend image_url to frontend image
export type EventWithImage = Event & { image: string };

export interface EventCreate {
    title: string;
    description?: string;
    date: string;
    location?: string;
    category?: string;
    capacity?: number;
}

export interface EventUpdate {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    category?: string;
    capacity?: number;
}

export interface EventListResponse {
    events: Event[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
}

export interface EventSearchParams {
    query?: string;
    category?: string;
    page?: number;
    page_size?: number;
}

// Registration types
export interface Registration {
    id: string;
    user_id: string;
    event_id: string;
    registration_date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    updated_at: string;
    user?: User;
    event?: Event;
}

export interface RegistrationCreate {
    status?: string;
}

export interface RegistrationListResponse {
    registrations: Registration[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
}

// Admin types
export interface DashboardStats {
    total_users: number;
    total_events: number;
    total_registrations: number;
    recent_registrations: number;
}

// API error response
export interface ApiErrorResponse {
    detail: string;
    errors?: Array<{ field: string; message: string }>;
}
