import { useState, useEffect, useCallback } from 'react';
import { useReactionTimer } from '../hooks/useReactionTimer';

// Official word list: 30 Words + 30 Non-words
const STIMULI = [
  // Words
  { word: 'TELESCOPE', type: 'word' },
  { word: 'ORCHARD', type: 'word' },
  { word: 'SYRINGE', type: 'word' },
  { word: 'VELVET', type: 'word' },
  { word: 'SCULPTURE', type: 'word' },
  { word: 'BOULDER', type: 'word' },
  { word: 'CANVAS', type: 'word' },
  { word: 'VIOLIN', type: 'word' },
  { word: 'ANCHOR', type: 'word' },
  { word: 'LANTERN', type: 'word' },
  { word: 'PENDULUM', type: 'word' },
  { word: 'DAGGER', type: 'word' },
  { word: 'COMPASS', type: 'word' },
  { word: 'FOSSIL', type: 'word' },
  { word: 'MEADOW', type: 'word' },
  { word: 'AMBIGUITY', type: 'word' },
  { word: 'RESILIENCE', type: 'word' },
  { word: 'HYPOCRISY', type: 'word' },
  { word: 'NOSTALGIA', type: 'word' },
  { word: 'DILEMMA', type: 'word' },
  { word: 'AUTONOMY', type: 'word' },
  { word: 'PARADIGM', type: 'word' },
  { word: 'EMPATHY', type: 'word' },
  { word: 'PREJUDICE', type: 'word' },
  { word: 'INTEGRITY', type: 'word' },
  { word: 'MELANCHOLY', type: 'word' },
  { word: 'CYNICISM', type: 'word' },
  { word: 'EPIPHANY', type: 'word' },
  { word: 'VENGEANCE', type: 'word' },
  { word: 'SOLITUDE', type: 'word' },

  // Non-words / Pseudo-words
  { word: 'BLICKET', type: 'non-word' },
  { word: 'PRAMBLE', type: 'non-word' },
  { word: 'FLIRN', type: 'non-word' },
  { word: 'GLASTY', type: 'non-word' },
  { word: 'TRINDAL', type: 'non-word' },
  { word: 'VISTION', type: 'non-word' },
  { word: 'MORPENT', type: 'non-word' },
  { word: 'SNARKLE', type: 'non-word' },
  { word: 'FRELM', type: 'non-word' },
  { word: 'KROVITY', type: 'non-word' },
  { word: 'SPLENT', type: 'non-word' },
  { word: 'CHURLIK', type: 'non-word' },
  { word: 'PLONKET', type: 'non-word' },
  { word: 'WABURN', type: 'non-word' },
  { word: 'THROSP', type: 'non-word' },
  { word: 'CLEND', type: 'non-word' },
  { word: 'PROCTION', type: 'non-word' },
  { word: 'SKRINDLE', type: 'non-word' },
  { word: 'FRASK', type: 'non-word' },
  { word: 'GLORNT', type: 'non-word' },
  { word: 'SMEEN', type: 'non-word' },
  { word: 'BLONST', type: 'non-word' },
  { word: 'DRANIT', type: 'non-word' },
  { word: 'CRUPT', type: 'non-word' },
  { word: 'TELSORY', type: 'non-word' },
  { word: 'NUNGET', type: 'non-word' },
  { word: 'FLIST', type: 'non-word' },
  { word: 'PRALT', type: 'non-word' },
  { word: 'VELDENT', type: 'non-word' },
  { word: 'SMANT', type: 'non-word' },
];

const LexicalTask = ({ onComplete }) => {
  const [shuffledStimuli] = useState(() => [...STIMULI].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [showStimulus, setShowStimulus] = useState(false);
  const { startTimer, stopTimer, resetTimer } = useReactionTimer();

  const currentStimulus = shuffledStimuli[currentIndex];

  const handleResponse = useCallback((isWord) => {
    if (!showStimulus) return;

    const rt = stopTimer();
    const isCorrect = (isWord && currentStimulus.type === 'word') || 
                      (!isWord && currentStimulus.type === 'non-word');

    const newResult = {
      word: currentStimulus.word,
      type: currentStimulus.type,
      response: isWord ? 'word' : 'non-word',
      isCorrect,
      responseTimeMs: rt
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    setShowStimulus(false);

    if (currentIndex + 1 < shuffledStimuli.length) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500); // Inter-trial interval
    } else {
      onComplete(updatedResults);
    }
  }, [currentIndex, results, showStimulus, stopTimer, currentStimulus, onComplete, shuffledStimuli]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') handleResponse(true); // F for Word
      if (e.key === 'j' || e.key === 'J') handleResponse(false); // J for Non-word
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleResponse]);

  useEffect(() => {
    // Show stimulus after a short delay (fixation cross logic can be added here)
    const timer = setTimeout(() => {
      setShowStimulus(true);
      startTimer();
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, startTimer]);

  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <div className="h-24 flex items-center justify-center">
        {showStimulus ? (
          <span className="text-6xl font-bold tracking-widest">{currentStimulus.word}</span>
        ) : (
          <span className="text-6xl text-gray-600">+</span>
        )}
      </div>

      <div className="flex space-x-24 text-gray-400">
        <div className="flex flex-col items-center">
          <kbd className="px-4 py-2 bg-gray-800 border-b-4 border-gray-950 rounded-lg text-2xl font-bold text-white mb-2">F</kbd>
          <span>WORD</span>
        </div>
        <div className="flex flex-col items-center">
          <kbd className="px-4 py-2 bg-gray-800 border-b-4 border-gray-950 rounded-lg text-2xl font-bold text-white mb-2">J</kbd>
          <span>NON-WORD</span>
        </div>
      </div>

      <div className="text-gray-500 text-sm">
        {currentIndex + 1} / {shuffledStimuli.length}
      </div>
    </div>
  );
};

export default LexicalTask;
