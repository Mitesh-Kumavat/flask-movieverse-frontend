const API_BASE_URL = "https://flask-movieverse.onrender.com/";

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}api${endpoint}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


async function displayMovieDetails(movieId) {
  const movie = await fetchData(`/movie/${movieId}`);
  if (!movie) {
    console.error("Movie details not found.");
    return;
  }

  document.getElementById("moviePoster").src = movie.img_src || "placeholder.jpg";
  document.getElementById("movieTitle").textContent = movie.original_title;
  document.getElementById("movieYear").textContent = `Release Year: ${movie.year}`;
  document.getElementById("movieRuntime").textContent = `Runtime: ${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`;
  document.getElementById("movieLanguage").textContent = `Language: ${movie.language_1}`;
  document.getElementById("movieGenre").textContent = `Genre: ${movie.genre}`;
  document.getElementById("movieDirector").textContent = `Director: ${movie.director}`;
  document.getElementById("movieActor").textContent = `Main Actor: ${movie.actors_1}`;
  document.getElementById("movieDescription").textContent = movie.description || "No description available.";
}

async function displaySimilarMovies(movieId) {
  const movies = await fetchData(`/movie/${movieId}/similar`);
  if (!movies || movies.length === 0) {
    console.error("No similar movies found.");
    return;
  }

  const container = document.querySelector("#similarMovies .grid");
  container.innerHTML = movies.map((movie) =>
    `
    <div
      class="mx-3 sm:mx-6 max-sm:text-sm max-sm:font-normal text-lg font-medium p-2 transition-all duration-200 hover:scale-[1.2] max-sm:mx-auto max-sm:my-3 cursor-pointer md:mt-0 mb-8 bg-[#262626] border border-[#333333] rounded-xl ">
        <a href="/movieDetail.html?id=${movie.imdb_title_id}" class="block"
          style="max-width:195px; height: max-content;">
          <img loading="lazy" class="h-72 w-[13rem] max-sm:h-[12rem] max-sm:w-[9rem] rounded-lg" src="${movie.img_src}" alt="${movie.original_title}" />
            <h1 class="text-start mt-3 max-w-48 max-sm:max-w-32 overflow-x-hidden text-[#EAEAEA]">
              <span class="text-[#EAEAEA] font-bold">Name: </span>
                          ${movie.original_title}
            </h1>
            <h1 class="text-[#EAEAEA]">
              <span class="text-[#EAEAEA] font-bold">Rating: </span>
                <span class=" items-center">
                  <span class="text-white">${movie.avg_vote}/10</span>
                              <span class="ml-2 text-yellow-400">★</span>
                  </span>
            </h1>
              <h1 class="text-[#EAEAEA]">
                          <span class="text-[#EAEAEA] font-bold">Year: </span>
                          ${movie.year}
                </h1>
          </a>
    </div>
  `).join("");
}

// Extract movie ID from URL
const movieId = window.location.href.split("?id=")[1];

displayMovieDetails(movieId);
displaySimilarMovies(movieId);