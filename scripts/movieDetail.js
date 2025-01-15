import { fetchData, fetchMovieImage, loadingMovieCard, movieCard, loadingMovieDetail } from './util.js';


async function displaySimilarMovies(movieId) {
  const container = document.querySelector(".realted-movies");
  loadingMovieCard(container)
  const movies = await fetchData(`/movie/${movieId}/similar`);
  if (!movies || movies.length === 0) {
    console.error("No similar movies found.");
    return;
  }
  movieCard(container, movies)
}


async function fetchMovieData(movieId) {
  const data = await fetchData(`/movie/${movieId}`);
  const img_src = await fetchMovieImage(movieId);
  if (!data) {
    console.error("No movie data found.");
    return;
  }

  document.querySelector(".poster-here").innerHTML = `
  <img src="${img_src}" alt="${data.original_title}" class="w-auto h-[380px] sm:h-[500px] rounded-lg shadow-xl">
  `

  const hours = `${Math.floor(data.duration / 60)}h ${data.duration % 60}m`;

  document.querySelector(".movie-main-content-header").innerHTML = `
                        <div>
                        <h1 class="text-4xl md:text-5xl font-bold mb-4">${data.original_title}</h1>
                        <div class="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
                            <span>${data.year}</span>
                            <span>${hours} </span>
                            <span class="px-2 py-1 border border-gray-300 rounded">${data.language_1}</span>
                            <div class="flex items-center gap-2">
                                <span class="text-2xl font-bold">${data.avg_vote}</span>
                                <span class="text-yellow-500">★</span>
                            </div>
                        </div>
                    </div>
  `

  document.querySelector(".overview-content").innerHTML = `
  <p class="text-lg text-gray-300">
                            ${data.description}
                        </p>

                        <div class="space-y-2">
                            <div class="flex gap-8">
                                <span class="text-gray-400 mr-10">Starring</span>
                                <span class="text-gray-300">${data.actors}</span>
                            </div>
                            <div class="flex gap-8">
                                <span class="text-gray-400 w-24">Created by</span>
                                <span class="text-gray-300">${data.director}</span>
                            </div>
                            <div class="flex gap-8">
                                <span class="text-gray-400 w-24">Genre</span>
                                <div class="flex gap-2 flex-wrap">
                                    <span class="text-gray-300">${data.genre}</span>
                                </div>
                            </div>
                        </div>`

  document.querySelector(".trailer-here").innerHTML = `
    <iframe class="h-[200px] md:h-[340px] md:w-[550px] w-[400px]" src="${data.trailer_link}" frameborder="0"></iframe>
  `
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
  trailerTab.classList.add("text-gray-400")
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

fetchMovieData(movieId);
displaySimilarMovies(movieId);