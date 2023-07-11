// import necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// create an instance of express
const app = express();
const PORT = process.env.PORT || 3001;

// import the array of notes from db.json
const allnotes = require('./db/db.json');

// Set up Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET route to display all notes
app.get('/api/notes', (req, res) => {
    res.json(allnotes.slice(1));
});

// GET route to display homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET route to display notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Catch-all route to redirect to homepage if requested resource doesn't exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to create a new note
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];

    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

// POST route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allnotes);
    res.json(newNote);
});

// Function to delete a note
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }

}

// DELETE route to delete a note with given id
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allnotes);
    res.json(true);
});

// Start the server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});