import { API_BASE_URL, fetchData, movieCard, loadingMovieCard } from './util.js';

async function displayTopMovies() {
    try {
        const container = document.querySelector(".top-movies");
        loadingMovieCard(container)
        const movies = await fetchData("/top-movies");

        movieCard(container, movies)
    } catch (error) {
        console.error("Error fetching top movies:", error);
    }
}

async function displayFeaturedMovies() {
    try {
        const container = document.querySelector(".featured-movies");
        loadingMovieCard(container)
        const movies = await fetchData("/featured-movies");
        await movieCard(container, movies)
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

    const container = document.querySelector(".top-movies");

    function fetchMovies() {
        loadingMovieCard(container)
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
        movieCard(container, movies)
    }
});

const userId = localStorage.getItem("userId");
const authButtonsContainer = document.getElementById("authButtons");
if (userId) {
    authButtonsContainer.innerHTML = `
        <button id="logoutButton" class="bg-[#e50914] text-white px-4 py-1 rounded font-medium text-sm sm:text-base">
            Log Out
        </button>
    `;

    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("userId");
        window.location.href = "/";
    });
} else {
    authButtonsContainer.innerHTML = `
        <button class="bg-black/20 text-white border border-white/30 rounded px-4 max-sm:px-2 py-1 text-sm sm:text-base">
            <a href="./signup/index.html">Sign up</a>
        </button>
        <button class="bg-[#e50914] text-white px-4 py-1 rounded font-medium text-sm sm:text-base">
            <a href="./login/index.html">Log In</a>
        </button>
    `;
}

displayTopMovies();
displayFeaturedMovies();
