import { useState } from 'react';
import ParticipantForm from './components/ParticipantForm';
import LexicalTask from './components/LexicalTask';
import AdminDashboard from './components/AdminDashboard';
import { generatePDFReport } from './lib/reportGenerator';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

function App() {
  const [step, setStep] = useState('welcome'); // welcome, form, task, results, admin
  const [participant, setParticipant] = useState(null);
  const [results, setResults] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleStart = () => setStep('form');
  const handleAdminEnter = () => setStep('admin');

  const handleFormComplete = (data) => {
    setParticipant(data);
    setStep('task');
  };

  const handleTaskComplete = async (testData) => {
    setResults(testData);
    setStep('results');

    if (!isSupabaseConfigured) {
      console.log('Demo Mode: Skipping database save.');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Save participant to Supabase
      const { data: pData, error: pError } = await supabase
        .from('participants')
        .insert([{ 
          first_name: participant.firstName, 
          last_name: participant.lastName 
        }])
        .select()
        .single();

      if (pError) throw pError;

      // 2. Save trial results with participant ID
      const trialsToInsert = testData.map(t => ({
        participant_id: pData.id,
        stimulus: t.word,
        response_time_ms: Math.round(t.responseTimeMs),
        is_correct: t.isCorrect,
        trial_type: t.type
      }));

      const { error: tError } = await supabase
        .from('trial_results')
        .insert(trialsToInsert);

      if (tError) throw tError;
      console.log('Data successfully saved to Supabase');
    } catch (error) {
      console.error('Error saving data:', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPDF = () => {
    generatePDFReport(participant, results);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {step === 'welcome' && (
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-blue-500">Lexical Decision Task</h1>
          <p className="text-xl text-gray-400 max-w-lg">
            In this test, you will determine whether the strings of letters appearing on the screen are real words or not.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-lg font-bold transition-all transform hover:scale-105"
            >
              Continue
            </button>
            <button
              onClick={handleAdminEnter}
              className="text-gray-500 hover:text-gray-300 text-sm italic underline"
            >
              Admin Login
            </button>
          </div>
        </div>
      )}

      {step === 'admin' && (
        <div className="w-full flex flex-col items-center">
          <button 
            onClick={() => setStep('welcome')}
            className="mb-4 self-start text-blue-400 hover:underline"
          >
             ← Go Back
          </button>
          <AdminDashboard />
        </div>
      )}

      {step === 'form' && (
        <ParticipantForm onComplete={handleFormComplete} />
      )}

      {step === 'task' && (
        <LexicalTask onComplete={handleTaskComplete} />
      )}

      {step === 'results' && (
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-green-500">Test Completed!</h2>
          <p className="text-gray-400">Thank you for your participation.</p>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-lg">Accuracy: %{((results.filter(r => r.isCorrect).length / results.length) * 100).toFixed(1)}</p>
            <p className="text-lg text-blue-400 font-mono">
              Average RT: {(results.reduce((acc, r) => acc + r.responseTimeMs, 0) / results.length).toFixed(2)} ms
            </p>
            {isSaving && <p className="text-xs text-yellow-500 mt-2 animate-pulse">Saving data to database...</p>}
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={downloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg"
            >
              Download Results as PDF
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:underline"
            >
              Start New Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
