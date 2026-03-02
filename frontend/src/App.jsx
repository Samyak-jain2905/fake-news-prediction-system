import { useEffect, useState } from "react";
import PredictionForm from "./components/PredictionForm.jsx";
import PredictionResult from "./components/PredictionResult.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import PredictionStore from "./stores/PredictionStore.js";

function App() {
  const [state, setState] = useState(PredictionStore.getState());
  const [articleData, setArticleData] = useState({ title: "", text: "" });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const handleChange = () => setState(PredictionStore.getState());
    PredictionStore.on("change", handleChange);
    return () => {
      PredictionStore.off("change", handleChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleTextChange = (data) => {
    setArticleData(data);
  };

  return (
    <div className="app-shell">
      <header>
        <div className="header-content">
          <div className="header-text">
            <h1>🔍 Fake News Detector</h1>
            <p className="header-description">AI-powered news verification system. Get instant analysis of news articles with confidence scores.</p>
          </div>
          <div className="theme-toggle-wrapper">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </header>
      <main>
        <PredictionForm loading={state.loading} onTextChange={handleTextChange} />
        <PredictionResult {...state} title={articleData.title} text={articleData.text} />
        <HistoryPanel currentResult={state.result} currentTitle={articleData.title} />
      </main>
      <footer>
        <small>Powered by Machine Learning & React</small>
      </footer>
    </div>
  );
}

export default App;


