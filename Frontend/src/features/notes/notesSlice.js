import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import { getToken } from "../../utils/tokenUtils";

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.put(`/notes/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (data, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.post("/notes", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    allNotes: [],
    filteredNotes: [],
    selectedTags: [],
    searchQuery: "",
    fetching: false,
    mutating: false,
    error: null,
  },
  reducers: {
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    filterNotes: (state) => {
      let notes = state.allNotes;

      if (state.selectedTags.length > 0) {
        notes = notes.filter((note) =>
          note.tags.some((tag) => state.selectedTags.includes(tag))
        );
      }
      if (state.searchQuery) {
        notes = notes.filter(
          (note) =>
            note.title
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      state.filteredNotes = notes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.fetching = false;
        state.allNotes = action.payload;
        state.filteredNotes = action.payload; // Initialize filtered notes with all notes
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload;
      })
      .addCase(updateNote.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.mutating = false;
        // Update the note in allNotes and filteredNotes
        state.allNotes = state.allNotes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
        state.filteredNotes = state.filteredNotes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })
      .addCase(deleteNote.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.mutating = false;
        // Remove the note from allNotes and filteredNotes
        state.allNotes = state.allNotes.filter((note) => note._id !== action.payload);
        state.filteredNotes = state.filteredNotes.filter((note) => note._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })
      .addCase(createNote.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.mutating = false;
        state.allNotes = [action.payload, ...state.allNotes];
        state.filteredNotes = [action.payload, ...state.filteredNotes];
      })
      .addCase(createNote.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTags, setSearchQuery, filterNotes } =
  notesSlice.actions;
export default notesSlice.reducer;
