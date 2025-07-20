import './App.css'
import { useState, useEffect } from 'react';


function App() {
  const [notes, setNotes] = useState([]);

useEffect(() => {
  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
      alert('Could not load notes');
    }
  };

  fetchNotes();
}, []);


  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [searchText, setSearchText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

 

  const handleSave = async() => {
  if (!title.trim() || !content.trim()) return;

  
  if (isEditing) {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        });

        if (!response.ok) throw new Error('Failed to update note');

        const {note:updatedNote} = await response.json();
        const updatedNotes = notes.map(note =>
          note._id === editId ? updatedNote : note
        );

        setNotes(updatedNotes);
        setIsEditing(false);
        setEditId(null);
        setTitle('');
        setContent('');
      } catch (error) {
        console.error(error);
        alert('Could not update note.');
      }
  }
  else {
          const newNote = {
          title,
          content
          };

        try {
          const response = await fetch('http://localhost:5000/api/notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNote),
          });

          if (!response.ok) {
            throw new Error('Failed to add note');
          }

          const data = await response.json();
          setNotes([data.note, ...notes]);
          setTitle('');
          setContent('');
        } catch (error) {
          console.error(error);
          alert('Could not save note.');
        }
  }
};



  const editNote = (_id) => {
  const noteToEdit = notes.find(note => note._id === _id);
  if (!noteToEdit) return;
  setTitle(noteToEdit.title);
  setContent(noteToEdit.content);
  setIsEditing(true);
  setEditId(_id);
};
const cancelEdit = () => {
  setIsEditing(false);
  setEditId(null);
  setTitle('');
  setContent('');
};


  const filteredNotes = notes.filter(note =>
  note?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
  note?.content?.toLowerCase().includes(searchText.toLowerCase())
);



const deleteNote = async (_id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/notes/${_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete note');
    }

    setNotes(notes.filter(note => note._id !== _id));
  } catch (error) {
    console.error('Delete error:', error);
    alert('Could not delete note.');
  }
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
                <div key={note._id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                    <button
                    onClick={() => editNote(note._id)}
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


