import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const NoteEditor = ({
  editNote,
  handleEditChange,
  showDeleteModal,
  confirmDelete,
  cancelDelete,
  darkMode,
  mutating
}) => {
  // Formatting state for content only
  const [fontSize, setFontSize] = useState(16); // px
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  // AI summary state
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

  const handleFontSize = (delta) => {
    setFontSize((size) => Math.max(12, Math.min(32, size + delta)));
  };
  const resetFontSize = () => setFontSize(16);

  const handleAISummary = async () => {
    setSummaryLoading(true);
    setSummaryError("");
    setSummary("");
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({ inputs: editNote.content })
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSummary(data[0]?.summary_text || "No summary generated.");
    } catch (err) {
      setSummaryError("Failed to generate summary. Try again later.");
    } finally {
      setSummaryLoading(false);
    }
  };

  // Reset summary when switching notes
  useEffect(() => {
    setSummary("");
    setSummaryError("");
  }, [editNote?._id]);

  return (
    <div className="flex-1 flex items-center justify-center p-0 overflow-y-auto">
      {editNote ? (
        <div className={`w-[900px] h-[calc(100vh-32px)] mx-auto bg-white/80 dark:bg-white/10 rounded-xl shadow p-10 border ${darkMode ? "bg-white/10 border-white/20" : "bg-white border-gray-100"} flex flex-col justify-start`} style={{ minHeight: '90vh' }}>
          <input
            className={`w-full text-3xl font-bold mb-2 bg-transparent outline-none ${darkMode ? "text-white" : "text-gray-900"}`}
            value={editNote.title}
            onChange={e => handleEditChange("title", e.target.value)}
            placeholder="Title"
            disabled={mutating}
          />
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              className={`px-2 py-1 rounded border bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/20 text-lg font-bold shadow-sm transition-all duration-150 hover:bg-orange-100 dark:hover:bg-orange-400/20 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-400/40 active:bg-orange-200 dark:active:bg-orange-400/30 focus:outline-none ${darkMode ? "text-white" : "text-black"}`}
              onClick={() => handleFontSize(-2)}
              disabled={mutating}
              title="Decrease font size"
            >A-</button>
            <button
              type="button"
              className={`px-2 py-1 rounded border bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/20 text-lg font-bold shadow-sm transition-all duration-150 hover:bg-orange-100 dark:hover:bg-orange-400/20 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-400/40 active:bg-orange-200 dark:active:bg-orange-400/30 focus:outline-none ${darkMode ? "text-white" : "text-black"}`}
              onClick={resetFontSize}
              disabled={mutating}
              title="Reset font size"
            >A</button>
            <button
              type="button"
              className={`px-2 py-1 rounded border bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/20 text-lg font-bold shadow-sm transition-all duration-150 hover:bg-orange-100 dark:hover:bg-orange-400/20 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-400/40 active:bg-orange-200 dark:active:bg-orange-400/30 focus:outline-none ${darkMode ? "text-white" : "text-black"}`}
              onClick={() => handleFontSize(2)}
              disabled={mutating}
              title="Increase font size"
            >A+</button>
            <span className="mx-2 border-l border-gray-300 dark:border-white/20 h-5"></span>
            <button
              type="button"
              className={`px-2 py-1 rounded border border-gray-200 dark:border-white/20 font-bold shadow-sm transition-all duration-150 focus:outline-none hover:bg-orange-100 dark:hover:bg-orange-400/20 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-400/40 active:bg-orange-200 dark:active:bg-orange-400/30 ${isBold ? "bg-orange-100 dark:bg-orange-400/30 text-orange-500" : darkMode ? "bg-gray-100 dark:bg-white/10 text-white" : "bg-gray-100 text-black"}`}
              onClick={() => setIsBold(b => !b)}
              disabled={mutating}
              title="Bold"
            ><span style={{fontWeight: "bold"}}>B</span></button>
            <button
              type="button"
              className={`px-2 py-1 rounded border border-gray-200 dark:border-white/20 font-bold shadow-sm transition-all duration-150 focus:outline-none hover:bg-orange-100 dark:hover:bg-orange-400/20 hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-400/40 active:bg-orange-200 dark:active:bg-orange-400/30 ${isItalic ? "bg-orange-100 dark:bg-orange-400/30 text-orange-500" : darkMode ? "bg-gray-100 dark:bg-white/10 text-white" : "bg-gray-100 text-black"}`}
              onClick={() => setIsItalic(i => !i)}
              disabled={mutating}
              title="Italic"
            ><span style={{fontStyle: "italic"}}>I</span></button>
            <button
              type="button"
              className={`px-2 py-1 rounded border border-orange-300 bg-orange-50 dark:bg-orange-400/10 font-semibold shadow-sm transition-all duration-150 hover:bg-orange-200 dark:hover:bg-orange-400/20 focus:outline-none ${darkMode ? "text-orange-500" : "text-black"}`}
              onClick={handleAISummary}
              disabled={mutating || summaryLoading || !editNote.content.trim()}
              title="Generate AI Summary"
            >
              {summaryLoading ? "Generating..." : "AI Summary"}
            </button>
          </div>
          <textarea
            className={`w-full flex-1 mb-4 bg-transparent outline-none resize-none ${darkMode ? "text-white/80" : "text-gray-700"}`}
            value={editNote.content}
            onChange={e => handleEditChange("content", e.target.value)}
            placeholder="Write your note..."
            style={{ minHeight: '200px', fontSize: fontSize, fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal' }}
            disabled={mutating}
          />
          {/* AI Summary Output */}
          {summary && (
            <div className={`mt-6 p-4 rounded bg-orange-50 dark:bg-orange-400/10 border border-orange-200 dark:border-orange-400/30 ${darkMode ? "text-white/90" : "text-black"}`}>
              <div className="font-semibold mb-1 text-orange-500">AI Summary:</div>
              <div>{summary}</div>
            </div>
          )}
          {summaryError && (
            <div className="mt-4 text-red-500 text-sm">{summaryError}</div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {editNote.tags.map((tag, idx) => (
              <div key={idx} className={`flex items-center px-2 py-1 rounded text-xs font-medium gap-1 ${darkMode ? "bg-orange-400/20 text-white" : "bg-orange-100 text-orange-500"}`}>
                <input
                  className={`bg-transparent outline-none w-16 min-w-0 text-xs ${darkMode ? "text-white" : "text-orange-500"}`}
                  value={tag}
                  onChange={e => {
                    const newTags = [...editNote.tags];
                    newTags[idx] = e.target.value;
                    handleEditChange("tags", newTags);
                  }}
                  disabled={mutating}
                />
                <button
                  className="hover:bg-orange-200 dark:hover:bg-orange-400/40 rounded"
                  onClick={() => {
                    const newTags = editNote.tags.filter((_, i) => i !== idx);
                    handleEditChange("tags", newTags);
                  }}
                  type="button"
                  tabIndex={-1}
                  disabled={mutating}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              className={`px-2 py-1 rounded text-xs font-medium ${darkMode ? "bg-orange-400/20 text-white" : "bg-orange-100 text-orange-500"}`}
              onClick={() => handleEditChange("tags", [...editNote.tags, ""])}
              type="button"
              disabled={mutating}
            >
              + Tag
            </button>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center h-full w-full ${darkMode ? "text-white/60" : "text-gray-400"}`}>
          <h2 className="text-2xl font-semibold">Select a note to view</h2>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#232136] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Delete Note?</h3>
            <p className="mb-6 text-gray-700 dark:text-white/80">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={cancelDelete}
                disabled={mutating}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-orange-400 text-white hover:bg-orange-500 dark:hover:bg-orange-300 transition font-semibold"
                onClick={confirmDelete}
                disabled={mutating}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor; 