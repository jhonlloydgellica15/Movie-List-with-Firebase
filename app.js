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
        <td>${movie.data().title}</td>
        <td>${movie.data().director}</td>
        <td>${movie.data().release}</td>
        <td><a class="btn btn-danger remove">Delete</a></td>
    `;
    listMovie.appendChild(row);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#director").value = "";
    document.querySelector("#release").value = "";
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
    db.collection("movies").doc(id).delete();
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

  //Validate fields
  if (title === "" || director === "" || release === "") {
    MovieUI.showAlert("Please fill in all fields", "danger");
  } else {
    //Instantiate movie
    firebaseStorage.addMovie(title, director, release);

    MovieUI.showAlert("Movie Added", "success");

    //Clear all fields
    MovieUI.clearFields();
  }
});

//Remove data
document.querySelector("#movie-list").addEventListener("click", (e) => {
  const id = e.target.parentElement.parentElement.getAttribute("data-id");
  firebaseStorage.removeMovie(id);
  MovieUI.showAlert("Movie removed", "success");
});
