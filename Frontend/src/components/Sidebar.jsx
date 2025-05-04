import React, { useRef, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon, MoonIcon, SunIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/Logo.png";
import NoteifyLogo from "../assets/NoteifyLogo.png"

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  toggleDarkMode,
  search,
  setSearch,
  showTagFilter,
  setShowTagFilter,
  selectedTags,
  setSelectedTags,
  nonEmptyTags,
  toggleTag,
  handleCreateNote,
  filtered,
  fetching,
  selectedNote,
  setSelectedNote,
  noteMenuOpen,
  setNoteMenuOpen,
  handleDelete,
  handleLogout,
  filterDropdownRef,
  menuDropdownRef
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile (always visible on mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-orange-400 text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        style={{ display: mobileOpen ? 'none' : undefined }}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Sidebar for desktop (collapsible, always visible) */}
      <div
        className={`
          hidden md:flex flex-col transition-all duration-200 border-r border-gray-200 dark:border-white/20
          ${sidebarOpen ? "w-64" : "w-12"}
          ${darkMode ? "bg-white/10" : "bg-white"} backdrop-blur-md h-full
        `}
      >
        {/* Sidebar Header with Logo and Dark Mode Toggle */}
        <div className={`flex flex-col items-center gap-2 ${sidebarOpen ? "py-2" : "py-2"}`}>
          <div className="flex items-center justify-center gap-2 w-full">
            <img src={sidebarOpen ? Logo : NoteifyLogo} alt="Logo" className={sidebarOpen ? "h-10" : "h-8"} />
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
        {/* Collapse/expand button only on desktop */}
        <button
          className="self-end m-2 p-1 rounded hover:bg-orange-100 dark:hover:bg-white/20 md:block hidden"
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
                className={`flex-1 px-3 py-2 rounded ${
                  darkMode 
                    ? "bg-white/20 text-white placeholder-white/60 border-white/30" 
                    : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
                } border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
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
            <div className="flex-1 overflow-y-auto slick-scrollbar">
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
                            <TrashIcon className="h-4 w-4" />
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
      {/* Sidebar overlay for mobile (only when open, always expanded) */}
      {mobileOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-full w-4/5 max-w-xs z-40 flex flex-col border-r border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 backdrop-blur-md transition-transform duration-300"
            style={{ transform: mobileOpen ? 'translateX(0)' : '-translateX(100%)' }}
          >
            {/* Close button for mobile */}
            <button
              className="md:hidden absolute top-4 right-4 z-50 p-2 rounded bg-orange-400 text-white"
              onClick={() => setMobileOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {/* Always expanded sidebar content for mobile */}
            <div className="flex flex-col h-full">
              {/* Sidebar Header with Logo and Dark Mode Toggle */}
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="flex items-center justify-center gap-2 w-full">
                  <img src={Logo} alt="Logo" className="h-10" />
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
                </div>
              </div>
              {/* Search and filter */}
              <div className="flex items-center gap-2 mx-2 mb-2 relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded ${
                    darkMode 
                      ? "bg-white/20 text-white placeholder-white/60 border-white/30" 
                      : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
                  } border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
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
              {/* Notes list */}
              <div className="flex-1 overflow-y-auto slick-scrollbar">
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
                          onClick={() => {
                            setSelectedNote(note);
                            setMobileOpen(false);
                          }}
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
                              <TrashIcon className="h-4 w-4" />
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
            </div>
          </div>
          {/* Overlay background for mobile */}
          <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)}></div>
        </>
      )}
    </>
  );
};

export default Sidebar;
