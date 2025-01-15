
export const API_BASE_URL = "https://flask-movieverse.onrender.com";

export async function fetchMovieImage(imdbId) {
    const OMDB_API_KEY = '1e64c9b4';
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data.Poster || '';
    }
    return '';
}

export async function fetchData(endpoint) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${API_BASE_URL}/api${endpoint}`);
    }
    return await response.json();
}

export async function movieCard(container, movies) {

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
                        <span class="text-6xl font-bold opacity-80 backdrop bg-shadow">${index + 1}</span>
                    </div>
                </div>
                </a>
        </div>`).join("");

}

export function loadingMovieCard(container) {
    const skeletonCards = Array.from({ length: 5 }).map(() => `
        <div class="relative overflow-hidden rounded-xl flex-none w-[200px] sm:w-[260px] group cursor-pointer">
            <div class="w-full h-[315px] sm:h-[350px] bg-gray-700 rounded-xl animate-pulse"></div>
            <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-gray">
                <div class="flex items-center gap-2">
                   
                </div>
            </div>
        </div>
    `).join("");

    container.innerHTML = skeletonCards;
}

export function loadingMovieDetail(container) {
    container.innerHTML = `
      <div class="animate-pulse">
        <!-- Poster Section -->
        <div class="poster-here w-auto h-[380px] sm:h-[500px] bg-gray-800 rounded-lg shadow-xl mb-8"></div>
  
        <!-- Header Section -->
        <div class="movie-main-content-header space-y-4">
          <div class="h-10 bg-gray-800 rounded w-3/4"></div>
          <div class="flex items-center gap-4">
            <span class="h-6 bg-gray-800 rounded w-16"></span>
            <span class="h-6 bg-gray-800 rounded w-20"></span>
            <span class="h-8 bg-gray-800 rounded w-24"></span>
            <div class="flex items-center gap-2">
              <span class="h-6 bg-gray-800 rounded w-12"></span>
              <span class="h-6 bg-gray-700 rounded w-6"></span>
            </div>
          </div>
        </div>
  
        <!-- Overview Section -->
        <div class="overview-content space-y-6 mt-8">
          <div class="h-6 bg-gray-800 rounded w-full"></div>
          <div class="h-6 bg-gray-800 rounded w-3/4"></div>
          <div class="space-y-4">
            <div class="flex gap-8">
              <span class="h-6 bg-gray-700 rounded w-24"></span>
              <span class="h-6 bg-gray-800 rounded w-3/4"></span>
            </div>
            <div class="flex gap-8">
              <span class="h-6 bg-gray-700 rounded w-24"></span>
              <span class="h-6 bg-gray-800 rounded w-3/4"></span>
            </div>
            <div class="flex gap-8">
              <span class="h-6 bg-gray-700 rounded w-24"></span>
              <span class="h-6 bg-gray-800 rounded w-3/4"></span>
            </div>
          </div>
        </div>
  
        <!-- Trailer Section -->
        <div class="trailer-here w-[400px] md:w-[550px] h-[200px] md:h-[340px] bg-gray-800 rounded-lg mt-8"></div>
  
        <!-- Similar Movies Section -->
        <div class="realted-movies flex gap-4 mt-8">
          ${Array.from({ length: 10 }).map(() => `
            <div class="relative overflow-hidden rounded-xl flex-none w-[200px] sm:w-[260px]">
              <div class="w-full h-[315px] sm:h-[350px] bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
}
