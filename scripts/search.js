const API_BASE_URL = "https://flask-movieverse.onrender.com";

async function fetchSearchResults(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movie/search?search=${query}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


async function fetchMovieImage(imdbId) {
    const OMDB_API_KEY = '1e64c9b4';
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data.Poster || '';
    }
    return '';
}

async function displaySearchResults() {

    const query = new URLSearchParams(window.location.search).get('search');
    if (!query) {
        console.error("No search query provided.");
        return;
    }

    document.getElementById("searchQuery").innerHTML = query

    const movies = await fetchSearchResults(query);
    if (!movies || movies.length === 0) {
        document.getElementById("searchResults").innerHTML = "<p>No results found.</p>";
        return;
    }

    const moviesWithImages = await Promise.all(movies.map(async (movie) => {
        const imageSrc = await fetchMovieImage(movie.imdb_title_id);
        return { ...movie, img_src: imageSrc };
    }));

    const container = document.querySelector("#searchResults");

    console.log(moviesWithImages);

    container.innerHTML = moviesWithImages.map((movie, index) =>
        ` <div class="relative overflow-hidden rounded-xl flex-none w-[200px] sm:w-[260px] group cursor-pointer">
                <a href="/movieDetail.html?id=${movie.imdb_title_id}">
                    <img src="${movie.img_src}" 
                        alt="${movie.original_title}" 
                        class="w-full h-[315px] sm:h-[350px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-105">
                        
                

                    <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                        <div class="flex items-center gap-2">
                            <span class="text-6xl font-bold opacity-80  bg-shadow">${index + 1}</span>
                        </div>
                    </div>

                     <div
                    class="relative left-12 inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-4">
                    <div>
                        <h3 class="text-xl font-semibold">${movie.original_title}</h3>
                        <p> ${movie.year} | ${movie.duration}</p>
                    </div>
                </div>
                </a>
            </div>`).join("");
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("searchBar").value.trim();
    if (query) {
        window.location.href = `/searchResult.html?search=${query}`;
    }
});

displaySearchResults();