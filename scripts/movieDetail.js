// const API_BASE_URL = "http://127.0.0.1:5000";
const API_BASE_URL = "https://flask-movieverse.onrender.com";

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchMovieImage(imdbId) {
  const OMDB_API_KEY = '1e64c9b4';
  const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    return data.Poster || '';
  }
  return '';
}

async function displaySimilarMovies(movieId) {
  const movies = await fetchData(`/movie/${movieId}/similar`);
  if (!movies || movies.length === 0) {
    console.error("No similar movies found.");
    return;
  }
  const container = document.querySelector(".realted-movies");

  const moviesWithImages = await Promise.all(movies.map(async (movie) => {
    const imageSrc = await fetchMovieImage(movie.imdb_title_id);
    return { ...movie, img_src: imageSrc };
  }));

  container.innerHTML = moviesWithImages.map((movie, index) =>
    ` <div class="relative overflow-hidden rounded-xl flex-none w-[200px] sm:w-[260px] group cursor-pointer">
    <a href="/movieDetail.html?id=${movie.imdb_title_id}">
        <img src="${movie.img_src}" 
            alt="${movie.original_title}" 
            class="w-full h-[315px] sm:h-[350px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-105">
            <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                <div class="flex items-center gap-2">
                    <span class="text-6xl font-bold opacity-80 bg-shadow">${index + 1}</span>
                </div>
            </div>
            </a>
    </div>`).join("");

}

async function searchMovies(query) {
  const movies = await fetchData(`/movie/search?search=${query}`);
  if (!movies || movies.length === 0) {
    console.error("No movies found.");
    return;
  }

  const container = document.querySelector("#searchResults .grid");
  container.innerHTML = movies.map((movie) =>
    `
    <div class="mx-3 sm:mx-6 max-sm:text-sm max-sm:font-normal text-lg font-medium p-2 transition-all duration-200 hover:scale-[1.2] max-sm:mx-auto max-sm:my-3 cursor-pointer md:mt-0 mb-8 bg-[#262626] border border-[#333333] rounded-xl">
        <a href="/movieDetail.html?id=${movie.imdb_title_id}" class="block" style="max-width:195px; height: max-content;">
          <img loading="lazy" class="h-72 w-[13rem] max-sm:h-[12rem] max-sm:w-[9rem] rounded-lg" src="${movie.img_src}" alt="${movie.original_title}" />
          <h1 class="text-start mt-3 max-w-48 max-sm:max-w-32 overflow-x-hidden text-[#EAEAEA]">
            <span class="text-[#EAEAEA] font-bold">Name: </span>${movie.original_title}
          </h1>
          <h1 class="text-[#EAEAEA]">
            <span class="text-[#EAEAEA] font-bold">Rating: </span>
            <span class="items-center">
              <span class="text-white">${movie.avg_vote}/10</span>
              <span class="ml-2 text-yellow-400">★</span>
            </span>
          </h1>
          <h1 class="text-[#EAEAEA]">
            <span class="text-[#EAEAEA] font-bold">Year: </span>${movie.year}
          </h1>
        </a>
    </div>
    `).join("");
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

  // Example: Total minutes
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


// document.getElementById("searchForm").addEventListener("submit", function (e) {
// e.preventDefault(); // Prevent form submission
// const query = document.getElementById("searchBar").value.trim();
// if (query) {
// window.location.href = `/searchResult.html?search=${query}`;
// }
// });

const movieId = window.location.href.split("?id=")[1];

fetchMovieData(movieId);
displaySimilarMovies(movieId);