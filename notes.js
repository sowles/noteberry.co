let firebaseDB;
let user;
const sidebar = document.querySelector(".notesSidebar");

document.querySelector("#makeNewNote").addEventListener("click", () => {
  const noteId = createNote();
  if (noteId > 0) {
    displayNote(noteId);
  }
})



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebaseDB = firebase.firestore();
    user = user.uid;
    loadNotes();
  }
  else {
    window.location = "index.html";
  }
});

async function loadNotes(){
  // implement later
  let notes;
  firebaseDB.collection("notes").where("user", "==", user)
    .onSnapshot((notes) => {
      // fill up the sidebar
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

async function createNote() {
  try {
    const note = await firebaseDB.collection("notes").add({
      title: "Untitled",
      body: "",
      timestamp: Date.now(),
      user: user
    });
    return note.id;
  }
  catch(error) {
    alert(`Error: ${error}`);
    return 0;
  }
}
