import { useState, useEffect, useCallback } from 'react';
import { useReactionTimer } from '../hooks/useReactionTimer';
import { STIMULI } from '../lib/words';

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
      }, 250); // Faster inter-trial interval
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
    // Show stimulus after a short delay (fixed duration for precision)
    const timer = setTimeout(() => {
      setShowStimulus(true);
      startTimer();
    }, 500); // Reduced delay for faster flow

    return () => clearTimeout(timer);
  }, [currentIndex, startTimer]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] w-full py-8 px-4">
      <div className="text-gray-500 text-lg font-mono">
        {currentIndex + 1} / {shuffledStimuli.length}
      </div>

      <div className="flex-1 flex items-center justify-center">
        {showStimulus ? (
          <span className="text-7xl md:text-9xl font-semibold tracking-tight text-white drop-shadow-lg">
            {currentStimulus.word}
          </span>
        ) : (
          <span className="text-8xl md:text-[12rem] text-gray-800 font-light">+</span>
        )}
      </div>

      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 md:gap-12 mt-12">
        <button
          onClick={() => handleResponse(true)}
          className="flex flex-col items-center justify-center p-8 md:p-12 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-3xl shadow-xl transition-all transform active:scale-90 select-none group"
        >
          <kbd className="hidden md:block mb-4 px-4 py-2 bg-blue-800 rounded-lg text-2xl font-bold text-white border-b-4 border-blue-950">F</kbd>
          <span className="text-2xl md:text-4xl font-black text-white">WORD</span>
        </button>
        
        <button
          onClick={() => handleResponse(false)}
          className="flex flex-col items-center justify-center p-8 md:p-12 bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-3xl shadow-xl transition-all transform active:scale-90 select-none group"
        >
          <kbd className="hidden md:block mb-4 px-4 py-2 bg-red-800 rounded-lg text-2xl font-bold text-white border-b-4 border-red-950">J</kbd>
          <span className="text-2xl md:text-4xl font-black text-white">NON-WORD</span>
        </button>
      </div>
    </div>
  );
};

export default LexicalTask;
