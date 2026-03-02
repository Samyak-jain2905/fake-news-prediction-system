import { useState } from "react";
import { predictFakeNews } from "../actions/PredictionActions.js";
import FileUpload from "./FileUpload.jsx";

function PredictionForm({ loading, onTextChange }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    predictFakeNews({ title, text });
    if (onTextChange) {
      onTextChange({ title, text });
    }
  };

  const handleFileRead = (fileContent) => {
    const lines = fileContent.split("\n");
    if (lines.length > 0) {
      setTitle(lines[0].trim());
      setText(lines.slice(1).join("\n").trim());
      if (onTextChange) {
        onTextChange({ title: lines[0].trim(), text: lines.slice(1).join("\n").trim() });
      }
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Submit an Article</h2>
      
      <FileUpload onFileRead={handleFileRead} />
      
      <label>
        Headline
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (onTextChange) onTextChange({ title: e.target.value, text });
          }}
          placeholder="Enter the news title"
        />
      </label>
      <label>
        Body
        <textarea
          rows="8"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (onTextChange) onTextChange({ title, text: e.target.value });
          }}
          placeholder="Paste the article text"
        />
      </label>
      <button type="submit" disabled={loading} className="submit-button">
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Analyzing...
          </>
        ) : (
          "🔍 Analyze Article"
        )}
      </button>
    </form>
  );
}

export default PredictionForm;


