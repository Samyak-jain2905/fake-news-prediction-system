import { useState } from "react";

function FileUpload({ onFileRead }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFile = (file) => {
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileRead(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt file");
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };
  
  return (
    <div
      className={`file-upload ${isDragging ? "dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
    >
      <input
        type="file"
        id="file-input"
        accept=".txt"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <label htmlFor="file-input" className="file-upload-label">
        <span className="upload-icon">📎</span>
        <span>Upload Article (.txt)</span>
        <span className="upload-hint">or drag and drop</span>
      </label>
    </div>
  );
}

export default FileUpload;






