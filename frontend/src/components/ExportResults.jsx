function ExportResults({ result, title, text, analysisData }) {
  if (!result) return null;
  
  const exportToText = () => {
    const content = `
FAKE NEWS DETECTION REPORT
===========================

Article: ${title || "Untitled"}
Date: ${new Date().toLocaleString()}

PREDICTION
----------
Verdict: ${result.label}
Confidence: ${(result.score * 100).toFixed(1)}%
Status: ${result.label === "1" || String(result.label).toLowerCase() === "fake" ? "FAKE NEWS" : "REAL NEWS"}

${analysisData ? `
ANALYSIS
--------
${Object.entries(analysisData).map(([key, value]) => `${key}: ${value}`).join("\n")}
` : ""}

${text ? `\nArticle Text:\n${text.substring(0, 500)}...` : ""}
    `.trim();
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fake-news-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const copyToClipboard = () => {
    const content = `Fake News Detection Result:\nVerdict: ${result.label}\nConfidence: ${(result.score * 100).toFixed(1)}%\nStatus: ${result.label === "1" || String(result.label).toLowerCase() === "fake" ? "FAKE NEWS" : "REAL NEWS"}`;
    navigator.clipboard.writeText(content);
    alert("Results copied to clipboard!");
  };
  
  return (
    <div className="export-results">
      <h4>📤 Export Results</h4>
      <div className="export-buttons">
        <button onClick={exportToText} className="export-btn">
          📄 Download Report
        </button>
        <button onClick={copyToClipboard} className="export-btn">
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  );
}

export default ExportResults;






