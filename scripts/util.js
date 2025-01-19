
// export const API_BASE_URL = "https://flask-movieverse.onrender.com";
export const API_BASE_URL = "http://127.0.0.1:5000";

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

export function renderPoster(img_src, title) {
  document.querySelector(".poster-here").innerHTML = `
    <img src="${img_src}" alt="${title}" class="w-auto h-[380px] sm:h-[500px] rounded-lg shadow-xl">
  `;
}

export function renderMovieHeader(data) {
  const hours = `${Math.floor(data.duration / 60)}h ${data.duration % 60}m`;
  document.querySelector(".movie-main-content-header").innerHTML = `
    <div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4">${data.original_title}</h1>
      <div class="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
        <span>${data.year}</span>
        <span>${hours}</span>
        <span class="px-2 py-1 border border-gray-300 rounded">${data.language_1}</span>
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold">${data.avg_vote}</span>
          <span class="text-yellow-500">★</span>
        </div>
      </div>
    </div>
  `;
}

export function renderOverviewContent(data) {
  document.querySelector(".overview-content").innerHTML = `
    <p class="text-lg text-gray-300">${data.description}</p>
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
    </div>
  `;
}

export function renderTrailer(trailerLink) {
  document.querySelector(".trailer-here").innerHTML = `
    <iframe class="h-[200px] md:h-[340px] md:w-[550px] w-[400px]" src="${trailerLink}" frameborder="0"></iframe>
  `;
}

export function renderPosterSkeleton() {
  document.querySelector(".poster-here").innerHTML = `
    <div class="sm:w-[320px] w-[260px] h-[380px] sm:h-[500px] rounded-lg bg-gray-700 animate-pulse"></div>
  `;
}

export function renderMovieHeaderSkeleton() {
  document.querySelector(".movie-main-content-header").innerHTML = `
    <div>
      <div class="w-3/4 h-8 bg-gray-700 rounded mb-4 animate-pulse"></div>
      <div class="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
        <div class="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-20 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>      
        <div class="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  `;
}

export function renderOverviewContentSkeleton() {
  document.querySelector(".overview-content").innerHTML = `
    <div class="w-full h-6 bg-gray-700 rounded mb-4 animate-pulse"></div>
    <div class="space-y-2">
      <div class="flex gap-8">
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div class="flex gap-8">
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div class="flex gap-8">
        <div class="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
        <div class="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  `;
}
