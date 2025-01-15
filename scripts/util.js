
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