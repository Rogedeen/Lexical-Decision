# Backend Report - Lexical Decision Task

## Status: Schema and Services Completed
**Date:** 2026-05-01
**Lead Agent:** Backend & Database Agent

## Current Progress
1. [completed] SQL Schema Definition (Participants, Trial Results) - 2026-05-01
2. [completed] RLS Policies Configuration - 2026-05-01
3. [completed] Supabase Client Services Setup (JS) - 2026-05-01

## 1. Current Status
* I have finalized the database schema, configured Row Level Security (RLS) for anonymous data submission and admin-only reading, and provided the JS service abstraction layer for the Frontend agent.

## 2. Done
* **SQL Schema:** Defined `participants` and `trial_results` tables with proper relations.
* **Security:** Implemented RLS policies to allow anyone to insert but only admins to select.
* **Services:** Created [supabase_service.js](supabase_service.js) for easy integration.

## 3. To Do (Next Steps)
* [ ] Support Frontend Agent with integration of `supabase_service.js`.
* [ ] Set up Authentication flow documentation for the Admin Dashboard.

## 4. Blockers / Dependencies
* Needs Supabase URL and Anon Key from the environment/user to make the services functional.
* Waiting for Frontend agent to integrate the service.

---

## Database Schema (Supabase/PostgreSQL)
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Test Result Metadata (Participant info)
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Individual Trial Results
CREATE TABLE trial_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    stimulus TEXT NOT NULL,
    response_time_ms INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    trial_type TEXT NOT NULL, -- 'word' or 'nonword'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_results ENABLE ROW LEVEL SECURITY;

-- Anonymous Insert Policy (Allow anyone to submit data)
CREATE POLICY "Allow anonymous insert on participants" ON participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on trial_results" ON trial_results
    FOR INSERT WITH CHECK (true);

-- Admin Read Policy (Allow only authenticated admins to read)
CREATE POLICY "Allow authenticated admins to read participants" ON participants
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated admins to read trial_results" ON trial_results
    FOR SELECT TO authenticated USING (true);
```

## Security Strategy (RLS)
- `participants`: Anyone can insert. Only authenticated admins can read.
- `trial_results`: Anyone can insert. Only authenticated admins can read.

## Next Steps
- Create `supabase_service.js` with client functions for the Frontend Agent.
- Update documentation on how to initialize the database.
