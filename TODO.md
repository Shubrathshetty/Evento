# Supabase Full-Stack Integration TODO

## Database Schema Expansion
- [x] Create new migration for events, registrations, and tickets tables
- [x] Enable RLS and create policies for new tables
- [x] Update src/integrations/supabase/types.ts with new schema types

## Supabase Edge Functions
- [x] Create edge function for creating events (admin only)
- [x] Create edge function for approving registrations (admin only)
- [x] Create edge function for sending notifications

## Frontend Integration
- [x] Replace mock events data with Supabase queries
- [x] Add registration functionality using Supabase
- [x] Add ticket management features
- [x] Ensure role-based UI (admins can create/approve, users can register)
- [x] Update components to use new services

## Environment Security
- [x] Confirm only anon key is exposed in frontend
- [ ] Guide on using service role key for edge functions

## Testing and Deployment
- [ ] Run database migrations
- [ ] Deploy edge functions
- [ ] Test full integration
- [ ] Set up secure environment variables
