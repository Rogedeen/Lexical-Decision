import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { STIMULI, mapToOriginalOrder } from './words';

/**
 * Generates an Excel (XLSX) matrix report based on the specified format.
 * Rows: Participants (First Name, Last Name)
 * Columns: Name, Surname, 1 - WORD1, 2 - WORD2... 60 - WORD60, Total Time, Avg Time, Categories...
 * Footer: Global Average for each column
 */
export const exportMatrixExcel = (participantsData) => {
  if (!participantsData || participantsData.length === 0) return;

  // 1. Prepare Headers
  const baseHeaders = ["First Name", "Last Name"];
  const trialHeaders = STIMULI.map((s, i) => `${i + 1} - ${s.word}`);
  const summaryHeaders = [
    "Total Time", 
    "Average Time", 
    "Word Avg RT", 
    "Non-Word Avg RT", 
    "Concrete Avg RT", 
    "Abstract Avg RT"
  ];
  const headers = [...baseHeaders, ...trialHeaders, ...summaryHeaders];

  const calculateAvg = (trials, filterFn) => {
    const filtered = trials.filter(t => t.isCorrect && filterFn(t) && t.responseTimeMs > 0);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, t) => acc + t.responseTimeMs, 0);
    return sum / filtered.length;
  };

  // 2. Prepare Rows
  const rows = participantsData.map((p) => {
    // Map existing trials to the canonical 1-60 order
    const orderedTrials = mapToOriginalOrder(p.trials || []);
    
    const totalTime = orderedTrials.reduce((sum, t) => sum + (t.responseTimeMs || 0), 0);
    const avgTime = orderedTrials.length > 0 ? totalTime / orderedTrials.length : 0;

    // Advanced Metrics (Correct Only)
    const wordAvg = calculateAvg(orderedTrials, t => t.category === 'word');
    const nonWordAvg = calculateAvg(orderedTrials, t => t.category === 'non-word');
    const concreteAvg = calculateAvg(orderedTrials, t => t.subType === 'concrete');
    const abstractAvg = calculateAvg(orderedTrials, t => t.subType === 'abstract');

    const row = [p.firstName, p.lastName];
    
    // Values for canonical columns 1 to 60
    orderedTrials.forEach(t => {
      row.push(t.responseTimeMs || "");
    });

    row.push(totalTime.toFixed(0));
    row.push(avgTime.toFixed(2));
    row.push(wordAvg > 0 ? wordAvg.toFixed(2) : "-");
    row.push(nonWordAvg > 0 ? nonWordAvg.toFixed(2) : "-");
    row.push(concreteAvg > 0 ? concreteAvg.toFixed(2) : "-");
    row.push(abstractAvg > 0 ? abstractAvg.toFixed(2) : "-");
    
    return row;
  });

  // 3. Calculate Global Averages (Footer)
  const footerRow = ["GLOBAL AVERAGE", ""];
  
  // Averages for each specific word (columns 1 to 60)
  for (let colIndex = 0; colIndex < 60; colIndex++) {
    let sum = 0;
    let count = 0;

    participantsData.forEach((p) => {
      const ordered = mapToOriginalOrder(p.trials || []);
      const val = ordered[colIndex]?.responseTimeMs;
      if (typeof val === 'number' && val > 0) {
        sum += val;
        count++;
      }
    });
    footerRow.push(count > 0 ? (sum / count).toFixed(2) : "");
  }

  // Global Average for Total Time
  let totalSum = 0; let totalCount = 0;
  // Global Average for Session Avg Time
  let avgOfAvgSum = 0; let avgOfAvgCount = 0;
  // Global Advanced Metrics
  let gWordSum = 0; let gWordCount = 0;
  let gNonWordSum = 0; let gNonWordCount = 0;
  let gConcreteSum = 0; let gConcreteCount = 0;
  let gAbstractSum = 0; let gAbstractCount = 0;

  participantsData.forEach(p => {
    const ordered = mapToOriginalOrder(p.trials || []);
    
    // Summary
    const time = ordered.reduce((s, t) => s + t.responseTimeMs, 0);
    if (time > 0) { totalSum += time; totalCount++; }
    
    if (ordered.length > 0) {
      avgOfAvgSum += (time / ordered.length);
      avgOfAvgCount++;
    }

    // Advanced (Correct Only)
    const w = calculateAvg(ordered, t => t.category === 'word');
    if (w > 0) { gWordSum += w; gWordCount++; }
    
    const nw = calculateAvg(ordered, t => t.category === 'non-word');
    if (nw > 0) { gNonWordSum += nw; gNonWordCount++; }
    
    const c = calculateAvg(ordered, t => t.subType === 'concrete');
    if (c > 0) { gConcreteSum += c; gConcreteCount++; }
    
    const a = calculateAvg(ordered, t => t.subType === 'abstract');
    if (a > 0) { gAbstractSum += a; gAbstractCount++; }
  });

  footerRow.push(totalCount > 0 ? (totalSum / totalCount).toFixed(2) : "");
  footerRow.push(avgOfAvgCount > 0 ? (avgOfAvgSum / avgOfAvgCount).toFixed(2) : "");
  footerRow.push(gWordCount > 0 ? (gWordSum / gWordCount).toFixed(2) : "-");
  footerRow.push(gNonWordCount > 0 ? (gNonWordSum / gNonWordCount).toFixed(2) : "-");
  footerRow.push(gConcreteCount > 0 ? (gConcreteSum / gConcreteCount).toFixed(2) : "-");
  footerRow.push(gAbstractCount > 0 ? (gAbstractSum / gAbstractCount).toFixed(2) : "-");

  // 4. Create Workbook and Worksheet
  const worksheetData = [headers, ...rows, footerRow];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const colWidths = [
    { wch: 15 }, // First Name
    { wch: 12 }, // Last Name
    ...Array(60).fill({ wch: 12 }), // Word columns 1-60
    { wch: 12 }, // Total Time
    { wch: 12 }, // Average Time
    { wch: 15 }, // Word Avg RT
    { wch: 15 }, // Non-Word Avg RT
    { wch: 15 }, // Concrete Avg RT
    { wch: 15 }  // Abstract Avg RT
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Lexical Task Report");

  // 5. Generate and Download File
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `Lexical_Task_Detailed_Report_${new Date().getTime()}.xlsx`);
};
