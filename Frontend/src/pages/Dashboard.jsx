import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNotes } from "../features/notes/notesSlice";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { filteredNotes, loading } = useSelector((state) => state.notes);
  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);
  return (
    <div>
      <h2>Your Notes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        filteredNotes.map((note) => (
          <div key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>{note.tags.join(", ")}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
