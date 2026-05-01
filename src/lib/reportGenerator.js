import { jsPDF } from "jspdf";

export const generatePDFReport = (participant, results) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text("Lexical Decision Task Report", 20, 20);
  
  // Participant Info
  doc.setFontSize(12);
  doc.text(`Participant: ${participant.fullName}`, 20, 40);

  // Summary Stats
  const avgRT = results.reduce((acc, r) => acc + r.responseTimeMs, 0) / results.length;
  const accuracy = (results.filter(r => r.isCorrect).length / results.length) * 100;

  doc.text("--- Summary Statistics ---", 20, 60);
  doc.text(`Total Stimuli: ${results.length}`, 20, 70);
  doc.text(`Accuracy: %${accuracy.toFixed(2)}`, 20, 80);
  doc.text(`Average Response Time: ${avgRT.toFixed(2)} ms`, 20, 90);

  // Detailed Results - Full List
  doc.text("--- Detailed Results (Full 60 Items) ---", 20, 110);
  
  let yPos = 120;
  let xOffset = 20;

  results.forEach((res, i) => {
    // Add new page if necessary
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }

    const text = `${String(i + 1).padStart(2, '0')}. ${res.word.padEnd(12)} | ${res.isCorrect ? 'Correct  ' : 'Incorrect'} | ${res.responseTimeMs.toFixed(0)} ms`;
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.text(text, xOffset, yPos);
    yPos += 7;
  });

  doc.save(`LD_Task_Results_${participant.fullName.replace(/\s+/g, '_')}.pdf`);
};
