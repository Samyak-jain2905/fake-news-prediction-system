import { generateArticleSummary } from "../utils/textAnalysis.js";

function ArticleSummary({ text }) {
  if (!text || text.trim().length < 50) return null;
  
  const summary = generateArticleSummary(text);
  
  return (
    <div className="article-summary">
      <h3>📄 Article Summary</h3>
      <p className="summary-text">{summary}</p>
    </div>
  );
}

export default ArticleSummary;






