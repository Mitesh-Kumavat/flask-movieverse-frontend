import {
  fetchData,
  fetchMovieImage,
  loadingMovieCard,
  movieCard,
  renderPoster,
  renderMovieHeader,
  renderOverviewContent,
  renderTrailer,
  renderMovieHeaderSkeleton,
  renderPosterSkeleton,
  renderOverviewContentSkeleton
} from './util.js';

async function displaySimilarMovies(movieId) {
  const container = document.querySelector(".realted-movies");
  loadingMovieCard(container);
  const movies = await fetchData(`/movie/${movieId}/similar`);
  if (!movies || movies.length === 0) {
    console.error("No similar movies found.");
    return;
  }
  movieCard(container, movies);
}

async function fetchMovieData(movieId) {
  const data = await fetchData(`/movie/${movieId}`);
  const img_src = await fetchMovieImage(movieId);
  if (!data) {
    console.error("No movie data found.");
    return;
  }

  renderPoster(img_src, data.original_title);
  renderMovieHeader(data);
  renderOverviewContent(data);
  renderTrailer(data.trailer_link);
}

document.addEventListener("DOMContentLoaded", () => {
  const overviewTab = document.querySelector("#overviewTab");
  const trailerTab = document.querySelector("#trailerTab");
  const overviewContent = document.querySelector("#overview");
  const trailerContent = document.querySelector("#trailer");

  // Initially display the overview content and hide the trailer content
  overviewContent.classList.remove("hidden");
  trailerContent.classList.add("hidden");
  overviewTab.classList.add("border-b-2", "border-red-600", "text-white");
  trailerTab.classList.add("text-gray-400");
  trailerTab.classList.remove("border-red-600", "border-b-2", "text-white");

  // Event listener for the Overview tab
  overviewTab.addEventListener("click", () => {
    overviewContent.classList.remove("hidden");
    trailerContent.classList.add("hidden");
    overviewTab.classList.remove("text-gray-400");
    overviewTab.classList.add("border-b-2", "border-red-600", "text-white");
    trailerTab.classList.remove("border-red-600", "text-white", "border", "border-b-2");
    trailerTab.classList.add("text-gray-400");
  });

  trailerTab.addEventListener("click", () => {
    trailerContent.classList.remove("hidden");
    overviewContent.classList.add("hidden");
    trailerTab.classList.remove("text-gray-400");
    trailerTab.classList.add("border-red-600", "border-b-2", "text-white");
    overviewTab.classList.remove("border-red-600", "border-b-2", "text-white");
    overviewTab.classList.add("text-gray-400");
  });
});

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("searchBar").value.trim();
  if (query) {
    window.location.href = `/searchResult.html?search=${query}`;
  }
});

const movieId = window.location.href.split("?id=")[1];

// Render the skeleton UI
renderPosterSkeleton();
renderMovieHeaderSkeleton();
renderOverviewContentSkeleton();

fetchMovieData(movieId);
displaySimilarMovies(movieId);