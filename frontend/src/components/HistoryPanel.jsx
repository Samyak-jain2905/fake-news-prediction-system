import { useState, useEffect } from "react";

function HistoryPanel({ currentResult, currentTitle, onSelectHistory }) {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem("predictionHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);
  
  useEffect(() => {
    if (currentResult && currentTitle) {
      const saved = localStorage.getItem("predictionHistory");
      const existingHistory = saved ? JSON.parse(saved) : [];
      
      const newEntry = {
        id: Date.now(),
        title: currentTitle.substring(0, 60) + (currentTitle.length > 60 ? "..." : ""),
        label: currentResult.label,
        score: currentResult.score,
        timestamp: new Date().toISOString()
      };
      
      const updated = [newEntry, ...existingHistory.filter(h => h.title !== newEntry.title)].slice(0, 10);
      setHistory(updated);
      localStorage.setItem("predictionHistory", JSON.stringify(updated));
    }
  }, [currentResult, currentTitle]);
  
  if (history.length === 0) return null;
  
  return (
    <div className="history-panel card">
      <h3>📜 Recent Analyses</h3>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item" onClick={() => onSelectHistory && onSelectHistory(item)}>
            <div className="history-header">
              <span className={`history-badge ${item.label === "1" || String(item.label).toLowerCase() === "fake" ? "fake" : "real"}`}>
                {item.label === "1" || String(item.label).toLowerCase() === "fake" ? "⚠️" : "✅"}
              </span>
              <span className="history-score">{(item.score * 100).toFixed(0)}%</span>
            </div>
            <p className="history-title">{item.title}</p>
            <span className="history-time">
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryPanel;

