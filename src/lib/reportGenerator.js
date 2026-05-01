import { jsPDF } from "jspdf";

export const generatePDFReport = (participant, results) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text("Lexical Decision Task Report", 20, 20);
  
  // Participant Info
  doc.setFontSize(12);
  doc.text(`Participant: ${participant.fullName}`, 20, 40);
  doc.text(`Age: ${participant.age}`, 20, 50);
  doc.text(`Gender: ${participant.gender}`, 20, 60);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);

  // Summary Stats
  const avgRT = results.reduce((acc, r) => acc + r.responseTimeMs, 0) / results.length;
  const accuracy = (results.filter(r => r.isCorrect).length / results.length) * 100;

  doc.text("--- Summary Statistics ---", 20, 90);
  doc.text(`Total Stimuli: ${results.length}`, 20, 100);
  doc.text(`Accuracy: %${accuracy.toFixed(2)}`, 20, 110);
  doc.text(`Average Response Time: ${avgRT.toFixed(2)} ms`, 20, 120);

  // Results Table
  doc.text("--- Detailed Results ---", 20, 140);
  let yPos = 150;
  
  results.slice(0, 15).forEach((res, i) => {
    doc.text(`${i+1}. ${res.word} (${res.type === 'word' ? 'W' : 'NW'}): ${res.isCorrect ? 'C' : 'I'} - ${res.responseTimeMs.toFixed(0)}ms`, 25, yPos);
    yPos += 8;
  });

  if (results.length > 15) {
    doc.text("...and more", 25, yPos);
  }

  doc.save(`LD_Task_Results_${participant.fullName.replace(/\s+/g, '_')}.pdf`);
};
