//Class

class MovieUI {
  static displayMovie() {
    //Fetching realtime data from firebase and pass to render method addMovieList
    firebaseStorage.realtimeListener();
  }

  static addMovieList(movie) {
    const listMovie = document.querySelector("#movie-list");
    const row = document.createElement("tr");

    row.setAttribute("data-id", movie.id);
    row.innerHTML = `
        <td class="tbl-title">${movie.data().title}</td>
        <td class="tbl-director">${movie.data().director}</td>
        <td class="tbl-release">${movie.data().release}</td>
        <td class="edit"><a class="btn btn-primary update">Edit</a></td>
        <td><a class="btn btn-danger remove">Delete</a></td>
    `;
    listMovie.appendChild(row);
  }

  static clearFields(inputs) {
    inputs.forEach((input) => {
      document.querySelector(`#${input}`).value = "";
    });
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#movie-form");
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static showModal(el) {
    const modalBg = document.querySelector(".modal-bg");
    const modalContainer = document.querySelector(".modal");
    //Getting value of unique row inside of table
    const titleValue =
      el.parentElement.parentElement.querySelector(".tbl-title").textContent;
    const directorValue =
      el.parentElement.parentElement.querySelector(".tbl-director").textContent;
    const releaseValue =
      el.parentElement.parentElement.querySelector(".tbl-release").textContent;
    const docID = el.parentElement.parentElement.getAttribute("data-id");

    if (el.classList.contains("update")) {
      modalBg.classList.add("bg-active");

      //Put value on modal
      modalContainer.setAttribute("data-id", docID);
      document.querySelector("#modal-title").value = titleValue;
      document.querySelector("#modal-director").value = directorValue;
      document.querySelector("#modal-release").value = releaseValue;
    }
  }

  static closeModal() {
    const modalBg = document.querySelector(".modal-bg");
    modalBg.classList.remove("bg-active");
  }
}

class firebaseStorage {
  static realtimeListener() {
    let movieList = document.querySelector("#movie-list");
    db.collection("movies")
      .orderBy("title")
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          if (change.type == "added") MovieUI.addMovieList(change.doc);
          else if (change.type == "removed") {
            let tr = document.querySelector(`[data-id=${change.doc.id}]`);
            movieList.removeChild(tr);
          }
        });
      });
  }
  static addMovie(title, director, release) {
    db.collection("movies").add({
      title,
      director,
      release,
    });
  }

  static removeMovie(id) {
    const getId = id.parentElement.parentElement.getAttribute("data-id");

    if (id.classList.contains("remove")) {
      db.collection("movies").doc(getId).delete();

      MovieUI.showAlert("Movie removed", "success");
    }
  }
}

//Events
//Display when load
document.addEventListener("DOMContentLoaded", MovieUI.displayMovie);

//Add movie
document.querySelector("#movie-form").addEventListener("submit", (e) => {
  e.preventDefault();
  //Get value of input text
  const title = document.querySelector("#title").value;
  const director = document.querySelector("#director").value;
  const release = document.querySelector("#release").value;
  const inputArr = ["title", "director", "release"];

  //Validate fields
  if (title === "" || director === "" || release === "") {
    MovieUI.showAlert("Please fill in all fields", "danger");
  } else {
    //Instantiate movie
    firebaseStorage.addMovie(title, director, release);

    MovieUI.showAlert("Movie Added", "success");

    //Clear all fields
    MovieUI.clearFields(inputArr);
  }
});

//Open modal
document.querySelector("#movie-list").addEventListener("click", (e) => {
  MovieUI.showModal(e.target);
});

//Close modal
document
  .querySelector(".modal-close")
  .addEventListener("click", MovieUI.closeModal);

//Close modal for escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") MovieUI.closeModal();
});

//Remove data
document.querySelector("#movie-list").addEventListener("click", (e) => {
  firebaseStorage.removeMovie(e.target);
});
