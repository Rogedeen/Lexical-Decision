# Backend Report - Lexical Decision Task

## Status: Schema and Services Completed
**Date:** 2026-05-01
**Lead Agent:** Backend & Database Agent

## Current Progress
1. [completed] SQL Schema Definition (Participants, Trial Results) - 2026-05-01
2. [completed] RLS Policies Configuration - 2026-05-01
3. [completed] Supabase Client Services Setup (JS) - 2026-05-01

## 2. Admin Authentication Setup
Admin access is secured using Supabase Auth. 

### Implementation:
1.  **Client functions:** `adminLogin`, `adminLogout`, and `isAuthenticated` added to [supabase_service.js](supabase_service.js).
2.  **Dashboard Access:** The Frontend logic should use `isAuthenticated()` to guard the admin route.
3.  **Manual Admin Account Creation:**
    *   Go to **Supabase Dashboard -> Authentication -> Users**.
    *   Click **Add User -> Create New User**.
    *   Enter the Admin email and password.
    *   *Note:* Ensure "Confirm Email" is disabled in Auth Settings if you want to log in immediately.

## 1. Current Status (Post-Launch Audit)
* **Security:** Hardcoded API keys removed. Switched to `import.meta.env`.
* **Reliability:** Data fetch functions optimized for stimulus-matching (Excel reports).
* **New Features:** Added `deleteParticipant` logic for data management.

## 2. Done
* **Environment Security:** `supabase_service.js` now uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
* **Data Fetch Optimization:** `fetchFullReport` now returns a mapping-friendly structure with full stimulus data.
* **Delete Service:** Implemented `deleteParticipant(participantId)` with explicit trial cleanup.
* **RLS Audit:** Updated policies to allow `DELETE` and `UPDATE` only for authenticated admins.

## 3. Usage Guide for Frontend Agent (Updates)

### A. Deleting a Participant
```javascript
import { deleteParticipant } from './supabase_service.js';

// Call this from the admin panel
try {
    await deleteParticipant('participant-uuid-here');
    alert('Deleted successfully');
} catch (error) {
    alert('Delete failed: ' + error.message);
}
```

### B. Important Note on Excel Mapping
`fetchFullReport()` returns an array where each participant has a `trials` property. Each trial contains the `stimulus` string. 
Frontend should use this `stimulus` to match against its 1-60 word list to ensure correct column alignment in Excel exports.

## 4. SQL Configuration (Applied via MCP)
The following SQL changes have been successfully applied to the `xddluxjayupgyhzcjlla` project:

1.  **Updated RLS Policies:**
    *   `participants`: Anonymous users can `INSERT`. Authenticated Admins have `ALL` (Select, Update, Delete) access.
    *   `trial_results`: Anonymous users can `INSERT`. Authenticated Admins have `ALL` (Select, Update, Delete) access.
2.  **Foreign Key Cascade:**
    *   Added `ON DELETE CASCADE` to `trial_results_participant_id_fkey`. Deleting a participant now automatically cleans up their trial results.

## 5. Next Steps
* [ ] Frontend Agent to implement a "Delete" button in the Admin Dashboard linked to `deleteParticipant`.
* [ ] Verify that Vercel Environment Variables are correctly set.

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

-- 1. Anonymous Insert Policy (Allow anyone to submit data)
-- This allows participants to submit their results without logging in.
-- They can ONLY insert new records, cannot view or modify existing ones.
CREATE POLICY "Enable insert for anonymous users" ON participants
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON trial_results
    FOR INSERT 
    WITH CHECK (true);

-- Admin Read & Delete Policy (Allow only authenticated admins to read and delete)
-- Uses Supabase Auth to ensure only logged-in users (admins) can access/modify data.
CREATE POLICY "Enable select and delete for authenticated admins only" ON participants
    FOR ALL
    TO authenticated 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable select and delete for authenticated admins only" ON trial_results
    FOR ALL
    TO authenticated 
    USING (true)
    WITH CHECK (true);
```

## Security Strategy (RLS)
- `participants`: Anyone can insert. Only authenticated admins can read.
- `trial_results`: Anyone can insert. Only authenticated admins can read.

## Next Steps
- Create `supabase_service.js` with client functions for the Frontend Agent.
- Update documentation on how to initialize the database.
