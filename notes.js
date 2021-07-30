let firebaseDB;
let userID;
const sidebar = document.querySelector("#notesSidebar__list");
const noteWrapper = document.querySelector(".note__wrapper");

document.querySelector("#makeNewNote").addEventListener("click", () => {
  const noteId = createNote();
  if (noteId > 0) {
    displayNote(noteId);
  }
})



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebaseDB = firebase.firestore();
    userID = user.uid;
    loadNotes();
  }
  else {
    window.location = "index.html";
  }
});

async function loadNotes(){
  // implement later
  let notes;
  firebaseDB.collection("notes").where("user", "==", userID)
    .onSnapshot((notes) => {
      // fill up the sidebar
      while (sidebar.firstChild) {
        sidebar.removeChild(sidebar.firstChild);
      }
      notes.forEach((note) => {
        const button = document.createElement("button");
        button.textContent = note.data()["title"];
        button.addEventListener("click", () => {
          displayNote(note.id);
        });
        button.classList.add("notesSidebar__noteEntry");
        button.dataset.noteID = note.id;
        sidebar.appendChild(button);
      });
    });
}

async function displayNote(noteID) {
  sidebar.childNodes.forEach((el) => {
    el.classList.remove("notesSidebar__noteEntry--currentNote");
  });
  sidebar.querySelector("button[data-note-i-d='" + noteID + "']").classList.add("notesSidebar__noteEntry--currentNote");

  firebaseDB.collection("notes").doc(noteID)
    .onSnapshot((note) => {
      while (noteWrapper.firstChild) {
        noteWrapper.removeChild(noteWrapper.firstChild);
      }
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "🗑️";
      deleteButton.addEventListener("click", (el) => {
        deleteNote(noteID);

      });
      noteWrapper.appendChild(deleteButton);
      const noteTitleInput = document.createElement("input");
      noteTitleInput.id = "noteTitle";
      noteTitleInput.placeholder = "Untitled";
      noteTitleInput.addEventListener("change", (el) => {
        saveNote(noteID);
      });
      noteWrapper.appendChild(noteTitleInput);
      noteTitleInput.value = note.data()["title"];

      const noteBodyInput = document.createElement("textarea");
      noteBodyInput.id = "noteBody";
      noteBodyInput.placeholder = "Write here";
      noteBodyInput.addEventListener("change", (el) => {
        saveNote(noteID);
      });
      noteWrapper.appendChild(noteBodyInput);
      noteBodyInput.value = note.data()["body"];

    });
}

async function saveNote(noteID) {
  try {
    await firebaseDB.collection("notes").doc(noteID).update({
      title: document.querySelector("#noteTitle").value,
      body: document.querySelector("#noteBody").value,
      timestamp: Date.now()
    });
  }
  catch(error) {
    alert(`Error: ${error}`);
  }
}


async function createNote() {
  try {
    const note = await firebaseDB.collection("notes").add({
      title: "Untitled",
      body: "",
      timestamp: Date.now(),
      user: userID
    });
    return note.id;
  }
  catch(error) {
    alert(`Error: ${error}`);
    return 0;
  }


}

async function deleteNote(noteID){
  try {
    await firebaseDB.collection("notes").doc(noteID).delete();
    while (noteWrapper.firstChild) {
      noteWrapper.removeChild(noteWrapper.firstChild);
    }
  }
  catch(error) {
    alert(`Error: ${error}`);
    return 0;
  }
}
