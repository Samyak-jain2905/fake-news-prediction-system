import CircularGauge from "./CircularGauge.jsx";
import ExplanationSection from "./ExplanationSection.jsx";
import ArticleSummary from "./ArticleSummary.jsx";
import AnalysisMetrics from "./AnalysisMetrics.jsx";
import ExportResults from "./ExportResults.jsx";

function PredictionResult({ loading, error, result, title, text }) {
  // Determine if news is fake based on label
  // Handles various label formats: "1", 1, "Fake", "fake", etc.
  const getIsFake = () => {
    if (!result || !result.label) return false;
    const label = String(result.label).toLowerCase().trim();
    return label === "1" || label === "fake" || label === "true";
  };
  
  const isFake = getIsFake();
  const isReal = result && !isFake;
  const confidence = result ? result.score * 100 : 0;

  return (
    <section className="card">
      <h2>Model Output</h2>
      {loading && (
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Analyzing article content...</p>
        </div>
      )}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && result && (
        <div className="result">
          <div className={`prediction-badge ${isFake ? "fake" : "real"}`}>
            {isFake ? "⚠️ FAKE NEWS" : "✅ REAL NEWS"}
          </div>
          
          <div className="confidence-visualization">
            <CircularGauge percentage={confidence} isFake={isFake} size={140} />
            <div className="confidence-info">
              <div className="confidence-header">
                <span className="confidence-label">
                  Confidence Level
                  <span className="tooltip-icon" title="Confidence Score: How certain the model is about this prediction">ℹ️</span>
                </span>
                <span className="confidence-value">{confidence.toFixed(1)}%</span>
              </div>
              <div className="confidence-bar" title={`Confidence Score: ${confidence.toFixed(1)}%`}>
                <div 
                  className={`confidence-fill ${isFake ? "fake" : "real"}`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="result-details">
            <p>
              <span className="detail-label">Verdict:</span> 
              <strong>{result.label}</strong>
            </p>
          </div>
          
          {text && (
            <>
              <ArticleSummary text={text} />
              <AnalysisMetrics text={text} />
              <ExplanationSection result={result} title={title} text={text} isFake={isFake} />
              <ExportResults result={result} title={title} text={text} />
            </>
          )}
        </div>
      )}
      {!loading && !error && !result && (
        <div className="empty-state">
          <p>📰 Submit an article above to get instant verification</p>
        </div>
      )}
    </section>
  );
}

export default PredictionResult;


