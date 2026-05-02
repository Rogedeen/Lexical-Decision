import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Saves participant information to the database.
 * @param {Object} participant - Participant details.
 * @param {string} participant.firstName - First name.
 * @param {string} participant.lastName - Last name.
 * @returns {Promise<Object>} The saved participant record.
 */
export async function saveParticipant(participant) {
    const { firstName, lastName } = participant;
    const { data, error } = await supabase
        .from('participants')
        .insert([{ first_name: firstName, last_name: lastName }])
        .select()
        .single();

    if (error) {
        console.error('Error saving participant:', error.message);
        throw error;
    }
    return data;
}

/**
 * Saves a list of trial results associated with a participant.
 * @param {string} participantId - The UUID of the participant.
 * @param {Array<Object>} results - Array of trial results.
 * @returns {Promise<Array>} The saved trial result records.
 */
export async function saveTrialResults(participantId, results) {
    const formattedResults = results.map(result => ({
        participant_id: participantId,
        stimulus: result.stimulus,
        response_time_ms: result.responseTimeMs,
        is_correct: result.isCorrect,
        trial_type: result.trialType
    }));

    const { data, error } = await supabase
        .from('trial_results')
        .insert(formattedResults);

    if (error) {
        console.error('Error saving trial results:', error.message);
        throw error;
    }
    return data;
}

/**
 * Admin Login using Supabase Auth.
 * @param {string} email - Admin email.
 * @param {string} password - Admin password.
 * @returns {Promise<Object>} The session/user data.
 */
export async function adminLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login error:', error.message);
        throw error;
    }
    return data;
}

/**
 * Admin Logout.
 * @returns {Promise<void>}
 */
export async function adminLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error.message);
        throw error;
    }
}

/**
 * Checks if a user is currently logged in.
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

/**
 * Fetches all participants and their results (Admin only).
 * Requires authenticated session.
 * @returns {Promise<Array>} List of participants with results.
 */
export async function fetchFullReport() {
    const { data, error } = await supabase
        .from('participants')
        .select(`
            id,
            first_name,
            last_name,
            created_at,
            trial_results (
                id,
                stimulus,
                response_time_ms,
                is_correct,
                trial_type,
                created_at
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching full report:', error.message);
        throw error;
    }

    // Returning a clean, flattened structure for the frontend
    return data.map(participant => ({
        id: participant.id,
        firstName: participant.first_name,
        lastName: participant.last_name,
        date: participant.created_at,
        trials: participant.trial_results
    }));
}
export async function getAllResults() {
    const { data, error } = await supabase
        .from('participants')
        .select(`
            *,
            trial_results (*)
        `);

    if (error) {
        console.error('Error fetching all results:', error.message);
        throw error;
    }
    return data;
}
