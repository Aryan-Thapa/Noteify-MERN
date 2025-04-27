import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, updateNote, deleteNote, createNote } from "../features/notes/notesSlice";
import { useDarkMode } from "../context/DarkModeContext";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon, MoonIcon, SunIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import NoteifyLogo from "../assets/Logo.png";
import { logout } from "../features/auth/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { filteredNotes, fetching } = useSelector((state) => state.notes);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [noteMenuOpen, setNoteMenuOpen] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [editTimeout, setEditTimeout] = useState(null);

  const filterDropdownRef = useRef();
  const menuDropdownRef = useRef();

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  // Get all unique tags from filteredNotes
  const allTags = Array.from(new Set(filteredNotes.flatMap(note => note.tags)));

  // Filter notes by search query and selected tags
  const filtered = filteredNotes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) &&
    (selectedTags.length === 0 || note.tags.some(tag => selectedTags.includes(tag)))
  );

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // When a note is selected, set editNote state
  useEffect(() => {
    if (selectedNote) {
      setEditNote({ ...selectedNote });
    } else {
      setEditNote(null);
    }
  }, [selectedNote]);

  // Autosave note edits
  useEffect(() => {
    if (!editNote || !editNote._id) return;
    if (editTimeout) clearTimeout(editTimeout);
    setEditTimeout(
      setTimeout(() => {
        dispatch(updateNote({ id: editNote._id, data: editNote }));
      }, 1000)
    );
    // eslint-disable-next-line
  }, [editNote?.title, editNote?.content, JSON.stringify(editNote?.tags)]);

  const handleEditChange = (field, value) => {
    setEditNote((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setNoteToDelete(id);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      dispatch(deleteNote(noteToDelete));
      if (selectedNote && selectedNote._id === noteToDelete) setSelectedNote(null);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const handleCreateNote = async () => {
    const defaultNote = {
      title: "Untitled Note",
      content: "",
      tags: [],
      isPinned: false,
      isArchived: false,
      reminderDate: null,
    };
    const action = await dispatch(createNote(defaultNote));
    if (action.payload && action.payload._id) {
      setSelectedNote(action.payload);
    }
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowTagFilter(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) {
        setNoteMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // In the filter dropdown, only show tags that are not empty
  const nonEmptyTags = allTags.filter(tag => tag.trim() !== "");

  return (
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-[#1f1c2c] to-[#928dab]" : "bg-gray-100"}`}>
      {/* Sidebar */}
      <div
        className={`flex flex-col transition-all duration-200 border-r border-gray-200 dark:border-white/20 ${sidebarOpen ? "w-64" : "w-12"} ${darkMode ? "bg-white/10" : "bg-white"} backdrop-blur-md`}
      >
        {/* Sidebar Header with Logo and Dark Mode Toggle */}
        <div className={`flex flex-col items-center gap-2 ${sidebarOpen ? "py-2" : "py-2"}`}>
          <div className="flex items-center justify-center gap-2 w-full">
            <img src={NoteifyLogo} alt="Noteify Logo" className={sidebarOpen ? "h-10" : "h-8"} />
            {sidebarOpen && (
              <button
                onClick={toggleDarkMode}
                className="ml-2 p-2 rounded-full bg-orange-400 text-white hover:bg-orange-500 transition"
                title="Toggle dark mode"
                type="button"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
        <button
          className="self-end m-2 p-1 rounded hover:bg-orange-100 dark:hover:bg-white/20"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          {sidebarOpen ? (
            <ChevronLeftIcon className="h-5 w-5 text-orange-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-orange-400" />
          )}
        </button>
        {sidebarOpen && (
          <>
            <div className="flex items-center gap-2 mx-2 mb-2 relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-white dark:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-white/30 placeholder-gray-400 dark:placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                className="p-2 rounded hover:bg-orange-100 dark:hover:bg-white/20"
                onClick={() => setShowTagFilter(v => !v)}
                title="Filter by tags"
                type="button"
              >
                <FunnelIcon className="h-5 w-5 text-orange-400" />
              </button>
              {/* Tag Filter Dropdown */}
              {showTagFilter && (
                <div ref={filterDropdownRef} className="absolute left-36 top-10 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/20 rounded shadow-lg p-3 w-56">
                  <div className="mb-2 text-xs font-semibold text-gray-700 dark:text-white">Filter by tags</div>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                    {nonEmptyTags.length === 0 ? (
                      <span className="text-gray-400 text-xs">No tags</span>
                    ) : (
                      nonEmptyTags.map(tag => (
                        <label key={tag} className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 dark:text-white">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                            className="accent-orange-400"
                          />
                          {tag}
                        </label>
                      ))
                    )}
                  </div>
                  <button
                    className="mt-2 w-full py-1 rounded bg-orange-400 text-white text-xs font-semibold hover:bg-orange-500 transition"
                    onClick={() => setSelectedTags([])}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            {/* Create Note Button below search bar */}
            <button
              onClick={handleCreateNote}
              className="mx-2 mb-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-400 text-white font-semibold hover:bg-orange-500 transition shadow"
              title="Create Note"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create
            </button>
            <div className="flex-1 overflow-y-auto">
              {fetching ? (
                <p className="m-2 text-gray-500 dark:text-white/70">Loading...</p>
              ) : (
                filtered.length === 0 ? (
                  <p className="m-2 text-gray-500 dark:text-white/70">No notes found.</p>
                ) : (
                  filtered.map(note => (
                    <div
                      key={note._id}
                      className="relative group flex items-center"
                    >
                      <div
                        onClick={() => setSelectedNote(note)}
                        className={`flex-1 px-4 py-2 cursor-pointer rounded-lg mx-2 my-1 transition-colors duration-150 ${selectedNote && selectedNote._id === note._id ? "bg-orange-100 dark:bg-orange-400/20 text-orange-500 font-semibold" : "hover:bg-orange-50 dark:hover:bg-white/10"} ${darkMode ? "text-white" : "text-gray-800"}`}
                      >
                        {note.title}
                      </div>
                      <button
                        className="p-1 ml-1 rounded hover:bg-orange-100 dark:hover:bg-orange-400/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteMenuOpen(noteMenuOpen === note._id ? null : note._id);
                        }}
                      >
                        <EllipsisVerticalIcon className="h-5 w-5 text-orange-400" />
                      </button>
                      {/* Dropdown menu */}
                      {noteMenuOpen === note._id && (
                        <div ref={menuDropdownRef} className="absolute right-8 top-1 z-20 bg-white dark:bg-[#232136] border border-gray-200 dark:border-white/10 rounded shadow-lg p-2">
                          <button
                            className="flex items-center gap-2 text-orange-500 hover:text-white hover:bg-orange-400 dark:hover:bg-orange-500 px-3 py-1 text-sm rounded transition"
                            onClick={() => handleDelete(note._id)}
                          >
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )
              )}
            </div>
            {/* Logout Button at the bottom */}
            <div className="mt-auto mb-4 px-2">
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg bg-orange-400 text-white font-semibold hover:bg-orange-500 transition shadow"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-0 overflow-y-auto">
        {editNote ? (
          <div className={`w-[900px] h-[calc(100vh-32px)] mx-auto bg-white/80 dark:bg-white/10 rounded-xl shadow p-10 border ${darkMode ? "bg-white/10 border-white/20" : "bg-white border-gray-100"} flex flex-col justify-start`} style={{ minHeight: '90vh' }}>
            <input
              className={`w-full text-3xl font-bold mb-2 bg-transparent outline-none ${darkMode ? "text-white" : "text-gray-900"}`}
              value={editNote.title}
              onChange={e => handleEditChange("title", e.target.value)}
              placeholder="Title"
            />
            <textarea
              className={`w-full flex-1 mb-4 bg-transparent outline-none resize-none ${darkMode ? "text-white/80" : "text-gray-700"}`}
              value={editNote.content}
              onChange={e => handleEditChange("content", e.target.value)}
              placeholder="Write your note..."
              style={{ minHeight: '200px' }}
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {editNote.tags.map((tag, idx) => (
                <div key={idx} className="flex items-center bg-orange-100 dark:bg-orange-400/20 text-orange-500 px-2 py-1 rounded text-xs font-medium gap-1">
                  <input
                    className="bg-transparent outline-none w-16 min-w-0 text-xs text-orange-500"
                    value={tag}
                    onChange={e => {
                      const newTags = [...editNote.tags];
                      newTags[idx] = e.target.value;
                      handleEditChange("tags", newTags);
                    }}
                  />
                  <button
                    className="hover:bg-orange-200 dark:hover:bg-orange-400/40 rounded"
                    onClick={() => {
                      const newTags = editNote.tags.filter((_, i) => i !== idx);
                      handleEditChange("tags", newTags);
                    }}
                    type="button"
                    tabIndex={-1}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                className="bg-orange-100 dark:bg-orange-400/20 text-orange-500 px-2 py-1 rounded text-xs font-medium"
                onClick={() => handleEditChange("tags", [...editNote.tags, ""])}
                type="button"
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
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-orange-400 text-white hover:bg-orange-500 dark:hover:bg-orange-300 transition font-semibold"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
