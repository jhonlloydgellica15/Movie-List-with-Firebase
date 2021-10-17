//State
class Movie {
  constructor(title, director, yrRelease) {
    this.title = title;
    this.director = director;
    this.yrRelease = yrRelease;
  }
}

class MovieUI {
  static displayMovie() {
    const storedMovies = [
      {
        title: "Superman",
        director: "Coco Martin",
        yrRelease: "2018",
      },
      {
        title: "Batman",
        director: "Coco Martin",
        yrRelease: "2018",
      },
      {
        title: "Dora",
        director: "Coco Martin",
        yrRelease: "2018",
      },
    ];

    const movies = storedMovies;
    movies.forEach((movie) => MovieUI.addMovieList(movie));
  }

  static addMovieList(movie) {
    const listMovie = document.querySelector("#movie-list");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${movie.title}</td>
        <td>${movie.director}</td>
        <td>${movie.yrRelease}</td>
        <td><a class="btn btn-danger remove">Delete</a></td>
    `;
    listMovie.appendChild(row);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#director").value = "";
    document.querySelector("#release").value = "";
  }

  static removeMovie(element) {
    if (element.classList.contains("remove")) {
      element.parentElement.parentElement.remove();
    }
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
    const movie = new Movie(title, director, release);

    //Add all value of input text on movie list UI
    MovieUI.addMovieList(movie);

    MovieUI.showAlert("Movie Added", "success");

    //Clear all fields
    MovieUI.clearFields();
  }
});

//Remove data
document.querySelector("#movie-list").addEventListener("click", (e) => {
  MovieUI.removeMovie(e.target);
  MovieUI.showAlert("Movie removed", "success");
});
