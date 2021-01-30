let firebaseDB;
let userID;
const sidebar = document.querySelector("#notesSidebar__list");
const noteWrapper = document.querySelector(".noteWrapper");

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
        sidebar.appendChild(button);
      });
    });
}

async function displayNote(noteID) {
  // fetch the note, set the text fields equal to the note, pass through id to save

  firebaseDB.collection("notes").doc(noteID).get()
    .onSnapshot((note) => {
      while (noteWrapper.firstChild) {
        noteWrapper.removeChild(noteWrapper.firstChild);
      }


    })
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
