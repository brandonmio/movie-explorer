import { useEffect, useState } from "react";
import "./styles.css";

const API_KEY = "367dc9f21667fa3d13267bd1a529373e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  return (
    <div className="movie">
      <img
        src={
          movie.poster_path
            ? `${IMG_URL}${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p>Release Date: {movie.release_date || "N/A"}</p>
      <p>Rating: {movie.vote_average ?? "N/A"}</p>
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, searchQuery, sortOption]);

  async function fetchMovies(page = 1) {
    let url = "";

    if (searchQuery === "") {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;
    } else {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        searchQuery
      )}&page=${page}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      let movieResults = data.results || [];

      if (sortOption === "rating") {
        movieResults.sort((a, b) => b.vote_average - a.vote_average);
      }

      if (sortOption === "date") {
        movieResults.sort(
          (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)
        );
      }

      setMovies(movieResults);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  function handleSortChange(e) {
    setSortOption(e.target.value);
    setCurrentPage(1);
  }

  function handleNextPage() {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }

  return (
    <div>
      <header>
        <h1>Movie Explorer</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <select value={sortOption} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="date">Release Date</option>
          <option value="rating">Average Rating</option>
        </select>
      </div>

      <div id="movieContainer">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="pages">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-number">{currentPage}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}