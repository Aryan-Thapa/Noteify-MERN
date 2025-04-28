import React from "react";
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
          <textarea
            className={`w-full flex-1 mb-4 bg-transparent outline-none resize-none ${darkMode ? "text-white/80" : "text-gray-700"}`}
            value={editNote.content}
            onChange={e => handleEditChange("content", e.target.value)}
            placeholder="Write your note..."
            style={{ minHeight: '200px' }}
            disabled={mutating}
          />
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