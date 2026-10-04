```javascript
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const categorySelect = document.querySelector("#category-select");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function updateNoteCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function displayNotes() {
    notesList.innerHTML = "";

    const searchWords = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(note =>
        note.text.toLowerCase().includes(searchWords)
    );

    if (filteredNotes.length === 0) {
        if (searchWords !== "") {
            const message = document.createElement("li");
            message.textContent = "No notes match your search.";
            notesList.appendChild(message);
        }

        updateNoteCount();
        return;
    }

    filteredNotes.forEach(note => {
        const listItem = document.createElement("li");

        const categoryClass =
            `category-${note.category.toLowerCase()}`;

        listItem.className = `note-card ${categoryClass}`;

        listItem.innerHTML = `
            <button class="delete-btn" data-id="${note.id}">
                Delete
            </button>

            <p class="note-text">${note.text}</p>

            <span class="category-label">
                ${note.category}
            </span>

            <span class="note-date">
                ${note.createdAt}
            </span>
        `;

        notesList.appendChild(listItem);
    });

    updateNoteCount();
}

noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = categorySelect.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);

    saveNotes();
    displayNotes();

    noteInput.value = "";
    errorMessage.textContent = "";
});

notesList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const id = Number(event.target.dataset.id);

        notes = notes.filter(note => note.id !== id);

        saveNotes();
        displayNotes();
    }
});

searchInput.addEventListener("input", function() {
    displayNotes();
});

clearAllBtn.addEventListener("click", function() {
    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        displayNotes();
    }
});

displayNotes();
```
