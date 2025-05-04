import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, updateNote, deleteNote, createNote } from "../features/notes/notesSlice";
import { useDarkMode } from "../context/DarkModeContext";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon, MoonIcon, SunIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import NoteifyLogo from "../assets/Logo.png";
import { logout } from "../features/auth/authSlice";
import Sidebar from "../components/Sidebar";
import NoteEditor from "../components/NoteEditor";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { filteredNotes, fetching, mutating } = useSelector((state) => state.notes);
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
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        search={search}
        setSearch={setSearch}
        showTagFilter={showTagFilter}
        setShowTagFilter={setShowTagFilter}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        nonEmptyTags={nonEmptyTags}
        toggleTag={toggleTag}
        handleCreateNote={handleCreateNote}
        filtered={filtered}
        fetching={fetching}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        noteMenuOpen={noteMenuOpen}
        setNoteMenuOpen={setNoteMenuOpen}
        handleDelete={handleDelete}
        handleLogout={handleLogout}
        filterDropdownRef={filterDropdownRef}
        menuDropdownRef={menuDropdownRef}
      />
      <div className="flex-1 flex items-center justify-center p-0 overflow-y-auto md:pt-0 pt-24">
        <NoteEditor
          editNote={editNote}
          handleEditChange={handleEditChange}
          showDeleteModal={showDeleteModal}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
          darkMode={darkMode}
          mutating={mutating}
        />
      </div>
    </div>
  );
};

export default Dashboard;
