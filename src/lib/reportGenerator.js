import { jsPDF } from "jspdf";
import { mapToOriginalOrder } from "./words";

export const generatePDFReport = (participant, results) => {
  const doc = new jsPDF();
  
  // Basic setup for UTF-8 and Turkish character support 
  // Standard fonts in jsPDF usually struggle with Turkish characters without a custom .ttf font.
  // We use the 'Unicode' encoding flag if custom fonts were loaded, 
  // but for standard fonts, we ensure strings are handled cleanly.
  
  // Header
  doc.setFontSize(22);
  doc.text("Lexical Decision Task Report", 20, 20);
  
  // Participant Info
  doc.setFontSize(12);
  doc.text(`Participant: ${participant.fullName}`, 20, 40);

  // Summary Stats
  const correctCount = results.filter(r => r.isCorrect).length;
  const totalCount = results.length;
  const totalTime = results.reduce((acc, r) => acc + (r.responseTimeMs || 0), 0);
  const avgRT = totalTime / totalCount;
  const accuracy = (correctCount / totalCount) * 100;

  doc.text("--- Summary Statistics ---", 20, 60);
  doc.text(`Total Stimuli: ${totalCount}`, 20, 70);
  doc.text(`Accuracy: ${correctCount} / ${totalCount} (%${accuracy.toFixed(1)})`, 20, 80);
  doc.text(`Total Completion Time: ${(totalTime / 1000).toFixed(2)} seconds`, 20, 90);
  doc.text(`Average Response Time: ${avgRT.toFixed(2)} ms`, 20, 100);

  // Detailed Results
  const orderedResults = mapToOriginalOrder(results);
  const words = orderedResults.filter(r => r.category === 'word');
  const nonWords = orderedResults.filter(r => r.category === 'non-word');
  
  let yPos = 120;
  const xOffset = 20;

  const renderSection = (title, items) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 20, yPos);
    yPos += 10;
    
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    
    items.forEach((res, i) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }

      const displayWord = res.category === 'word' 
        ? `${res.word} (${res.subType})` 
        : res.word;
      
      const correctAns = res.type.toUpperCase();
      const givenAns = res.responseTimeMs > 0 
        ? (res.isCorrect ? correctAns : (correctAns === 'WORD' ? 'NON-WORD' : 'WORD'))
        : 'N/A';

      const text = `${String(i + 1).padStart(2, '0')}) ${displayWord.padEnd(25)} | ${correctAns.padEnd(8)} | ${givenAns.padEnd(8)} | ${res.responseTimeMs.toFixed(1).padStart(7)} ms | ${res.isCorrect ? 'Correct' : 'WRONG'}`;
      doc.text(text, xOffset, yPos);
      yPos += 6;
    });
    yPos += 5;
  };

  renderSection("--- REAL WORDS ---", words);
  renderSection("--- NON-WORDS ---", nonWords);

  doc.save(`LD_Task_Results_${participant.fullName.replace(/\s+/g, '_')}.pdf`);
};
