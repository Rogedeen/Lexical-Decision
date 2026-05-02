# Backend Report - Lexical Decision Task

### 1. Current Status
* Performing a security and schema audit of the Supabase backend.
* Verifying RLS policies for `participants` and `trial_results` tables.
* Ensuring snake_case naming convention in the database and correct camelCase mapping in the frontend.

### 2. Done
* **RLS Audit** - Completed on 2026-05-02
    * Verified `participants` table: Anyone (`public`) can `INSERT`. Only `authenticated` users can `SELECT`, `UPDATE`, and `DELETE`.
    * Verified `trial_results` table: Anyone (`public`) can `INSERT`. Only `authenticated` users can `SELECT`, `UPDATE`, and `DELETE`.
    * Confirmed that anonymous users have NO read or delete access to existing data.
* **Schema Verification** - Completed on 2026-05-02
    * Confirmed `participants` table columns are `first_name` and `last_name` (snake_case).
    * Verified that `src/services/supabaseService.js` correctly maps between frontend `firstName`/`lastName` and backend `first_name`/`last_name`.
    * Verified `AdminDashboard.jsx` correctly displays these fields.
* **Dependency Clean-up** - Completed on 2026-05-02
    * Ensured `src/services/supabaseService.js` is the single source of truth for database interactions, replacing the old root-level `supabase_service.js`.

### 3. To Do (Next Steps)
* [ ] Monitor database logs for any RLS violations during peak testing.
* [ ] Implement automated database backups if needed for production.

### 4. Blockers / Dependencies
* **Frontend:** No blockers. Admin Dashboard is currently using the correct mapping.
* **Orchestrator:** Ready for deployment validation.

---

## Technical Details

### Database Schema (Supabase/PostgreSQL)
| Table | Column | Type | Notes |
|-------|--------|------|-------|
| `participants` | `id` | UUID | Primary Key (Auto-generated) |
| `participants` | `first_name` | TEXT | Not Null |
| `participants` | `last_name` | TEXT | Not Null |
| `participants` | `created_at` | TIMESTAMPTZ | Default: now() |
| `trial_results` | `id` | UUID | Primary Key (Auto-generated) |
| `trial_results` | `participant_id` | UUID | Foreign Key -> `participants.id` (ON DELETE CASCADE) |
| `trial_results` | `stimulus` | TEXT | Word or Non-word |
| `trial_results` | `response_time_ms`| INTEGER | RT in milliseconds |
| `trial_results` | `is_correct` | BOOLEAN | |
| `trial_results` | `trial_type` | TEXT | |

### RLS Policies Applied
| Table | Policy Name | Role | CMD | Description |
|-------|-------------|------|-----|-------------|
| `participants` | Enable insert for anonymous users | `public` | INSERT | Allows participants to save info. |
| `participants` | Admin full access | `authenticated` | ALL | Full access for logged-in admins. |
| `trial_results` | Enable insert for anonymous users | `public` | INSERT | Allows saving individual trial data. |
| `trial_results` | Admin full access | `authenticated` | ALL | Full access for logged-in admins. |
