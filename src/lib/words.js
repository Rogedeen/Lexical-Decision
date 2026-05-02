// Official word list: 30 Words + 30 Non-words
// DO NOT CHANGE THE ORDER OF THIS LIST
export const STIMULI = [
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

/**
 * Maps results to the original 1-60 order based on the stimulus string.
 * This ensures that even if trials were randomized during the task,
 * they are exported/displayed in a consistent canonical order.
 */
export const mapToOriginalOrder = (results) => {
  if (!results) return [];
  
  return STIMULI.map((original) => {
    // Find the participant's result for this specific word
    const result = results.find(r => r.stimulus === original.word || r.word === original.word);
    return {
      ...original,
      // If the result exists, merge it, otherwise return partially empty
      response: result?.response || null,
      isCorrect: result?.isCorrect || false,
      responseTimeMs: result?.responseTimeMs || 0,
    };
  });
};
