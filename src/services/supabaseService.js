import { supabase } from '../lib/supabaseClient';

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
        stimulus: result.stimulus || result.word,
        response_time_ms: Math.round(result.responseTimeMs),
        is_correct: result.isCorrect,
        trial_type: result.trialType || result.type
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
 * Results are ordered by participant creation date (newest first).
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

    // Map to a clean structure. Note: stimulus is included to allow Frontend matching.
    return data.map(participant => ({
        id: participant.id,
        firstName: participant.first_name,
        lastName: participant.last_name,
        date: participant.created_at,
        trials: participant.trial_results.map(trial => ({
            id: trial.id,
            stimulus: trial.stimulus,
            responseTimeMs: trial.response_time_ms,
            isCorrect: trial.is_correct,
            trialType: trial.trial_type,
            createdAt: trial.created_at
        }))
    }));
}

/**
 * Deletes a participant and all their associated trial results.
 * Access: Admin Only (Enforced by RLS and session check).
 * @param {string} participantId - UUID of the participant to delete.
 */
export async function deleteParticipant(participantId) {
    // Check local session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Unauthorized: Admin login required.');

    // Note: If ON DELETE CASCADE is enabled in SQL, deleting from participants 
    // will automatically delete associated trial_results. 
    // To be safe and explicit:
    const { error: trialError } = await supabase
        .from('trial_results')
        .delete()
        .eq('participant_id', participantId);

    if (trialError) {
        console.error('Error deleting trial results:', trialError.message);
        throw trialError;
    }

    const { error: participantError } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId);

    if (participantError) {
        console.error('Error deleting participant:', participantError.message);
        throw participantError;
    }
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
