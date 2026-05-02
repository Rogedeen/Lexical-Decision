import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { STIMULI, mapToOriginalOrder } from './words';

/**
 * Generates an Excel (XLSX) matrix report based on the specified format.
 * Rows: Participants (First Name, Last Name)
 * Columns: Name, Surname, 1 - WORD1, 2 - WORD2... 60 - WORD60, Total Time, Avg Time
 * Footer: Global Average for each column
 */
export const exportMatrixExcel = (participantsData) => {
  if (!participantsData || participantsData.length === 0) return;

  // 1. Prepare Headers
  const baseHeaders = ["First Name", "Last Name"];
  const trialHeaders = STIMULI.map((s, i) => `${i + 1} - ${s.word}`);
  const summaryHeaders = ["Total Time", "Average Time"];
  const headers = [...baseHeaders, ...trialHeaders, ...summaryHeaders];

  // 2. Prepare Rows
  const rows = participantsData.map((p) => {
    // Map existing trials to the canonical 1-60 order
    const orderedTrials = mapToOriginalOrder(p.trials || []);
    
    const totalTime = orderedTrials.reduce((sum, t) => sum + (t.responseTimeMs || 0), 0);
    const avgTime = orderedTrials.length > 0 ? totalTime / orderedTrials.length : 0;

    const row = [p.firstName, p.lastName];
    
    // Values for canonical columns 1 to 60
    orderedTrials.forEach(t => {
      row.push(t.responseTimeMs || "");
    });

    row.push(totalTime.toFixed(0));
    row.push(avgTime.toFixed(2));
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
  let totalSum = 0;
  let totalCount = 0;
  participantsData.forEach(p => {
    const trials = p.trials || [];
    const time = trials.reduce((s, t) => s + (t.response_time_ms || t.responseTimeMs || 0), 0);
    if (time > 0) {
      totalSum += time;
      totalCount++;
    }
  });
  footerRow.push(totalCount > 0 ? (totalSum / totalCount).toFixed(2) : "");

  // Global Average for Session Avg Time
  let avgOfAvgSum = 0;
  let avgOfAvgCount = 0;
  participantsData.forEach(p => {
    const trials = p.trials || [];
    if (trials.length > 0) {
      const pAvg = trials.reduce((s, t) => s + (t.response_time_ms || t.responseTimeMs || 0), 0) / trials.length;
      avgOfAvgSum += pAvg;
      avgOfAvgCount++;
    }
  });
  footerRow.push(avgOfAvgCount > 0 ? (avgOfAvgSum / avgOfAvgCount).toFixed(2) : "");

  // 4. Create Workbook and Worksheet
  const worksheetData = [headers, ...rows, footerRow];
  // SheetJS handles UTF-8 automatically for XLSX
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const colWidths = [
    { wch: 15 }, // First Name
    { wch: 12 }, // Last Name
    ...Array(60).fill({ wch: 12 }), // Word columns 1-60
    { wch: 12 }, // Total Time
    { wch: 12 }  // Average Time
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Lexical Task Report");

  // 5. Generate and Download File
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `Lexical_Task_Detailed_Report_${new Date().getTime()}.xlsx`);
};
