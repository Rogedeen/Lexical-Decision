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

## 1. Current Status
* Finalized Supabase Client Services with Auth and Fetch functions. The `supabase_service.js` file is now ready for Frontend integration.

## 2. Done
* **Supabase Client Logic:** Updated [supabase_service.js](supabase_service.js) with the following methods:
    * `adminLogin(email, password)`: Handles secure sign-in via Supabase Auth.
    * `adminLogout()`: Handles secure sign-out.
    * `fetchFullReport()`: Fetches all participants and their nested trial results in a single, easy-to-read JSON structure.
* **No SQL Required:** Confirmed that current SQL schema and RLS policies support these service calls.

## 3. Usage Guide for Frontend Agent
The Frontend Agent can import and use the following functions from [supabase_service.js](supabase_service.js):

### A. Authentication
```javascript
import { adminLogin, adminLogout } from './supabase_service.js';

// To login
try {
    const { user, session } = await adminLogin('admin@example.com', 'secure_password');
} catch (error) {
    console.error('Login failed:', error.message);
}

// To logout
await adminLogout();
```

### B. Fetching Results for Admin Dashboard
```javascript
import { fetchFullReport } from './supabase_service.js';

const reportData = await fetchFullReport();
/* 
Result Structure:
[
  {
    id: "uuid",
    firstName: "John",
    lastName: "Doe",
    date: "timestamp",
    trials: [
      { stimulus: "apple", responseTimeMs: 450, isCorrect: true, trialType: "word" },
      ...
    ]
  },
  ...
]
*/
```

## 4. To Do (Next Steps)
* [ ] Assist Frontend Agent with UI binding of `fetchFullReport`.
* [ ] Verify data persistence integrity during stress testing.

## 5. Blockers / Dependencies
* None. Ready for Frontend integration.

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

-- 2. Admin Read Policy (Allow only authenticated admins to read)
-- Uses Supabase Auth to ensure only logged-in users (admins) can access data.
CREATE POLICY "Enable select for authenticated admins only" ON participants
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable select for authenticated admins only" ON trial_results
    FOR SELECT 
    TO authenticated 
    USING (true);
```

## Security Strategy (RLS)
- `participants`: Anyone can insert. Only authenticated admins can read.
- `trial_results`: Anyone can insert. Only authenticated admins can read.

## Next Steps
- Create `supabase_service.js` with client functions for the Frontend Agent.
- Update documentation on how to initialize the database.
