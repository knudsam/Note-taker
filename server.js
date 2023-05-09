// import necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const database = require("./db/db.json");

// create an instance of express
const app = express();
const PORT = process.env.PORT || 3001;

// import the array of notes from db.json
const allnotes = require('./db/db.json');

// Set up Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET route to display all existing notes
app.get('/api/notes', (req, res) => {
    res.json(allnotes.slice(1));
});

// GET route to display the homepage
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes html and it's "url"
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// Function to create a new note
app.route("/api/notes")
    // Grab the notes list (this should be updated for every new note and deleted note.)
    .get(function (req, res) {
        res.json(database);
    })

    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        let highestId = 99;

        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {

                highestId = individualNote.id;
            }
        }

        newNote.id = highestId + 1;

        database.push(newNote)


        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });

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

// DELETE route to delete a note with a certain id
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allnotes);
    res.json(true);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server now running on port ${PORT}!`);
});