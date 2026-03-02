import { detectCategory, analyzeSentiment, calculateReadability } from "../utils/textAnalysis.js";

function AnalysisMetrics({ text }) {
  if (!text) return null;
  
  const category = detectCategory(text);
  const sentiment = analyzeSentiment(text);
  const readability = calculateReadability(text);
  
  return (
    <div className="analysis-metrics">
      <h3>📊 Analysis Metrics</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Category</span>
          <span className="metric-value">{category}</span>
        </div>
        
        <div className="metric-card">
          <span className="metric-label">Tone</span>
          <span className={`metric-value tone-${sentiment.tone.toLowerCase()}`}>
            {sentiment.tone}
          </span>
        </div>
        
        <div className="metric-card">
          <span className="metric-label">Emotion</span>
          <span className="metric-value">{sentiment.emotion}</span>
        </div>
        
        <div className="metric-card">
          <span className="metric-label">Readability</span>
          <span className="metric-value">{readability.level}</span>
        </div>
        
        <div className="metric-card">
          <span className="metric-label">Grade Level</span>
          <span className="metric-value">{readability.grade}</span>
        </div>
        
        <div className="metric-card">
          <span className="metric-label">Complexity</span>
          <span className={`metric-value complexity-${readability.complexity.toLowerCase()}`}>
            {readability.complexity}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AnalysisMetrics;






