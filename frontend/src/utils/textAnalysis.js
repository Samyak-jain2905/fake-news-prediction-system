// Text analysis utilities for frontend features

export function generateArticleSummary(text, maxSentences = 3) {
  if (!text || text.trim().length < 50) {
    return "Article too short to generate summary.";
  }
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length === 0) return "Unable to generate summary.";
  
  const summary = sentences.slice(0, maxSentences).join(". ").trim();
  return summary + (sentences.length > maxSentences ? "..." : ".");
}

export function detectCategory(text) {
  if (!text) return "General";
  
  const lowerText = text.toLowerCase();
  const categories = {
    "Politics": ["government", "minister", "election", "parliament", "political", "party", "vote", "democracy"],
    "Sports": ["match", "game", "player", "team", "sport", "championship", "tournament", "cricket", "football"],
    "Environment": ["climate", "environment", "pollution", "forest", "wildlife", "conservation", "green", "carbon"],
    "Education": ["school", "university", "student", "education", "teacher", "exam", "college", "learning"],
    "Technology": ["tech", "software", "digital", "computer", "internet", "ai", "app", "device"],
    "Health": ["health", "medical", "hospital", "doctor", "disease", "treatment", "medicine", "patient"],
    "Local News": ["local", "city", "district", "village", "community", "region", "area"]
  };
  
  let maxMatches = 0;
  let detectedCategory = "General";
  
  for (const [category, keywords] of Object.entries(categories)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedCategory = category;
    }
  }
  
  return detectedCategory;
}

export function analyzeSentiment(text) {
  if (!text) return { tone: "Neutral", emotion: "Neutral", score: 0 };
  
  const lowerText = text.toLowerCase();
  
  // Positive indicators
  const positiveWords = ["good", "great", "excellent", "amazing", "wonderful", "success", "achievement", "progress", "hope", "positive"];
  const negativeWords = ["bad", "terrible", "horrible", "disaster", "crisis", "problem", "issue", "fear", "danger", "threat", "warning"];
  const fearWords = ["fear", "afraid", "scared", "worried", "panic", "danger", "threat", "crisis", "emergency", "alert"];
  const optimisticWords = ["hope", "future", "better", "improve", "progress", "success", "achievement", "positive"];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  const fearCount = fearWords.filter(word => lowerText.includes(word)).length;
  const optimisticCount = optimisticWords.filter(word => lowerText.includes(word)).length;
  
  let tone = "Neutral";
  let emotion = "Neutral";
  const score = positiveCount - negativeCount;
  
  if (score > 2) tone = "Positive";
  else if (score < -2) tone = "Negative";
  
  if (fearCount > optimisticCount && fearCount > 2) emotion = "Fear";
  else if (optimisticCount > fearCount && optimisticCount > 2) emotion = "Optimism";
  else if (fearCount > 0) emotion = "Concern";
  
  return { tone, emotion, score };
}

export function calculateReadability(text) {
  if (!text || text.trim().length < 50) {
    return { level: "Unknown", grade: "N/A", complexity: "Low" };
  }
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const avgWordsPerSentence = words.length / sentences.length;
  const avgCharsPerWord = text.replace(/\s/g, "").length / words.length;
  
  // Simple Flesch-like calculation
  const complexity = avgWordsPerSentence > 20 || avgCharsPerWord > 5 ? "High" : 
                     avgWordsPerSentence < 10 || avgCharsPerWord < 4 ? "Low" : "Medium";
  
  let level = "Intermediate";
  let grade = "8-10";
  
  if (complexity === "High") {
    level = "Advanced";
    grade = "12+";
  } else if (complexity === "Low") {
    level = "Basic";
    grade = "5-7";
  }
  
  return { level, grade, complexity, avgWordsPerSentence: avgWordsPerSentence.toFixed(1) };
}

export function detectSuspiciousPatterns(text) {
  if (!text) return { isSuspicious: false, warnings: [] };
  
  const lowerText = text.toLowerCase();
  const warnings = [];
  
  // WhatsApp-forward style patterns
  if (lowerText.includes("forward") || lowerText.includes("share") || lowerText.includes("urgent")) {
    warnings.push("Contains forwarding language");
  }
  
  // Overly dramatic claims
  const dramaticPhrases = ["shocking", "you won't believe", "breaking", "exclusive", "secret", "they don't want you to know"];
  if (dramaticPhrases.some(phrase => lowerText.includes(phrase))) {
    warnings.push("Contains sensational language");
  }
  
  // Excessive punctuation
  if ((text.match(/[!]{2,}/g) || []).length > 2) {
    warnings.push("Excessive exclamation marks");
  }
  
  // All caps
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.3 && text.length > 50) {
    warnings.push("Excessive capitalization");
  }
  
  // Too short or generic
  if (text.length < 100) {
    warnings.push("Article is very short");
  }
  
  return {
    isSuspicious: warnings.length > 0,
    warnings
  };
}

export function extractKeywords(text, maxKeywords = 5) {
  if (!text) return [];
  
  // Simple keyword extraction (most frequent words excluding common words)
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", "will", "would", "should", "could", "may", "might", "this", "that", "these", "those", "it", "its", "they", "them", "we", "us", "you", "your", "he", "she", "his", "her"]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopWords.has(w));
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

export function generateExplanation(isFake, confidence, keywords, sentiment) {
  const explanations = [];
  
  if (isFake) {
    explanations.push("The model detected patterns commonly found in fake news articles.");
    if (sentiment.emotion === "Fear") {
      explanations.push("The article contains fear-inducing language, which is a common characteristic of misinformation.");
    }
    if (keywords.length > 0) {
      explanations.push(`Key terms like "${keywords.slice(0, 2).join('" and "')}" may have influenced the prediction.`);
    }
    if (confidence < 0.6) {
      explanations.push("The confidence level suggests some uncertainty - verify with trusted sources.");
    }
  } else {
    explanations.push("The article shows characteristics of credible news content.");
    if (sentiment.tone === "Neutral" || sentiment.tone === "Positive") {
      explanations.push("The neutral to positive tone is consistent with factual reporting.");
    }
    if (keywords.length > 0) {
      explanations.push(`The content focuses on topics like "${keywords.slice(0, 2).join('" and "')}".`);
    }
  }
  
  return explanations;
}






