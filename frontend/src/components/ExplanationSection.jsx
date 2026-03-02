import { extractKeywords, generateExplanation, detectSuspiciousPatterns } from "../utils/textAnalysis.js";

function ExplanationSection({ result, title, text, isFake }) {
  if (!result || !text) return null;
  
  const keywords = extractKeywords(text, 5);
  const suspicious = detectSuspiciousPatterns(text);
  const explanations = generateExplanation(isFake, result.score * 100, keywords, { emotion: "Neutral", tone: "Neutral" });
  
  return (
    <div className="explanation-section">
      <h3>Why this prediction?</h3>
      
      <div className="explanation-content">
        {explanations.map((explanation, idx) => (
          <p key={idx} className="explanation-point">
            {explanation}
          </p>
        ))}
      </div>
      
      {keywords.length > 0 && (
        <div className="keywords-section">
          <h4>Key Terms Detected</h4>
          <div className="keywords-list">
            {keywords.map((keyword, idx) => (
              <span key={idx} className="keyword-tag">{keyword}</span>
            ))}
          </div>
        </div>
      )}
      
      {suspicious.isSuspicious && (
        <div className="warning-section">
          <h4>⚠️ Warning Indicators</h4>
          <ul className="warning-list">
            {suspicious.warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ExplanationSection;






