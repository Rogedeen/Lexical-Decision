import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

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
 * Fetches all participants and their results (Admin only).
 * Requires authenticated session.
 * @returns {Promise<Array>} List of participants with results.
 */
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
