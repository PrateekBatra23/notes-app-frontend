import './App.css'
import { useState, useEffect } from 'react';


function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
  localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [searchText, setSearchText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

 

  const handleSave = () => {
  if (!title.trim() || !content.trim()) return;

  if (isEditing) {
    const updatedNotes = notes.map(note =>
      note.id === editId ? { ...note, title, content } : note
    );
    setNotes(updatedNotes);
    setIsEditing(false);
    setEditId(null);
  } else {
    const newNote = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
  }

  setTitle('');
  setContent('');
};

  const editNote = (id) => {
  const noteToEdit = notes.find(note => note.id === id);
  if (!noteToEdit) return;
  setTitle(noteToEdit.title);
  setContent(noteToEdit.content);
  setIsEditing(true);
  setEditId(id);
};
const cancelEdit = () => {
  setIsEditing(false);
  setEditId(null);
  setTitle('');
  setContent('');
};


  const filteredNotes = notes.filter(note =>
  note.title.toLowerCase().includes(searchText.toLowerCase()) ||
  note.content.toLowerCase().includes(searchText.toLowerCase())
  );


  const deleteNote = (id) => {
  setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className='body'>
      <div className="app-container">
        <h1 className="title">📝 Notes App</h1>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-box"/>

        <button
        onClick={() => setNotes([])}
        className="delete-btn"
        style={{ marginBottom: '1rem', position: 'static' }}>
        Clear All Notes
        </button>


        <div className="input-section">
          <input type="text" placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-box"/>
            <textarea 
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="textarea-box">
              </textarea>
            <button onClick={handleSave} className="add-btn">
              {isEditing ? "Update Note" : "Add Note"}
            </button>
            {isEditing && (
              <button onClick={cancelEdit} className="cancel-btn">
                Cancel
              </button>
            )}


          </div>
          <p className="notes-count">Total Notes: {notes.length}</p>

          <div className="notes-section">
            {filteredNotes.length === 0 ? (
              <p className="no-notes">No notes</p>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                    <button
                    onClick={() => editNote(note.id)}
                    className="edit-btn"
                    >
                    Edit
                  </button>

                </div>
      ))
    )}
  </div>
</div>
</div>

  );
}

export default App;


