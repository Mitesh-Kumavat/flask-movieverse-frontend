import { API_BASE_URL, fetchMovieImage, fetchData } from './util.js';

async function displayTopMovies() {
    try {
        const container = document.querySelector(".top-movies");
        container.innerHTML = `<p class="text-center font-bold text-2xl w-full mt-6">Loading...</p>`;

        const movies = await fetchData("/top-movies");

        // Fetch movie images for each movie
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
    } catch (error) {
        console.error("Error fetching top movies:", error);
    }
}

async function displayFeaturedMovies() {
    try {
        const container = document.querySelector(".featured-movies");
        container.innerHTML = `<p class="text-center font-bold text-2xl w-full mt-6">Loading...</p>`;

        const movies = await fetchData("/featured-movies");

        // Fetch movie images for each movie
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
                            <span class="text-6xl font-bold opacity-80  bg-shadow">${index + 1}</span>
                        </div>
                    </div>
                </a>
            </div>`).join("");
    } catch (error) {
        console.error("Error fetching featured movies:", error);
    }
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("searchBar").value.trim();
    if (query) {
        window.location.href = `/searchResult.html?search=${query}`;
    }
});

// left-right buttons
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.overflow-x-auto');
    const leftButtons = document.querySelectorAll('.left-nav');
    const rightButtons = document.querySelectorAll('.right-nav');

    leftButtons.forEach((leftButton, index) => {
        leftButton.addEventListener('click', () => {
            const slider = sliders[index];
            if (slider) {
                slider.scrollBy({
                    left: -300,
                    behavior: 'smooth',
                });
            }
        });
    });

    rightButtons.forEach((rightButton, index) => {
        rightButton.addEventListener('click', () => {
            const slider = sliders[index]; // Match the slider to the button
            if (slider) {
                slider.scrollBy({
                    left: 300,
                    behavior: 'smooth',
                });
            }
        });
    });
});

// filter options
document.addEventListener("DOMContentLoaded", function () {
    const genreFilter = document.getElementById("genreFilter");
    const languageFilter = document.getElementById("languageFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const yearFilter = document.getElementById("yearFilter");

    function buildFilterUrl() {

        let url = `${API_BASE_URL}/api/movies/filter?`;
        const genre = genreFilter.value ? `genre=${genreFilter.value}` : "";
        const language = languageFilter.value ? `language=${languageFilter.value}` : "";
        const rating = ratingFilter.value ? `min_rating=${ratingFilter.value}` : "";
        const year = yearFilter.value ? `min_year=${yearFilter.value.split("-")[0]}&max_year=${yearFilter.value.split("-")[1]}` : "";

        const filters = [genre, language, rating, year].filter(Boolean).join("&");
        url += filters;

        return url;
    }

    genreFilter.addEventListener("change", function () {
        fetchMovies();
    });
    languageFilter.addEventListener("change", function () {
        fetchMovies();
    });
    ratingFilter.addEventListener("change", function () {
        fetchMovies();
    });
    yearFilter.addEventListener("change", function () {
        fetchMovies();
    });

    function fetchMovies() {
        console.log("fetching movies");
        const url = buildFilterUrl();
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.movies.length === 0) {
                    console.log("NO MOVIES");
                    document.querySelector(".top-movies").innerHTML = `<p class="text-center font-bold text-2xl w-full mt-6">No movies found</p>`;
                    return;
                }
                updateMovieCards(data.movies);
            })
            .catch(error => console.error("Error fetching movies:", error));
    }

    async function updateMovieCards(movies) {
        const container = document.querySelector(".top-movies");
        container.innerHTML = "";
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
                            <span class="text-6xl font-bold opacity-80  bg-shadow">${index + 1}</span>
                        </div>
                    </div>
                    </a>
            </div>`).join("");
    }
});

displayTopMovies();
displayFeaturedMovies();
