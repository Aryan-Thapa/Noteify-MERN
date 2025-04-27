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

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    allNotes: [],
    filteredNotes: [],
    selectedTags: [],
    searchQuery: "",
    loading: false,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.allNotes = action.payload;
        state.filteredNotes = action.payload; // Initialize filtered notes with all notes
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTags, setSearchQuery, filterNotes } =
  notesSlice.actions;
export default notesSlice.reducer;
