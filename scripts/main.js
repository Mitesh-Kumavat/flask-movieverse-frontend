const API_BASE_URL = "https://flask-movieverse.onrender.com";

async function fetchData(endpoint) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${API_BASE_URL}/api${endpoint}`);
    }
    return await response.json();
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

async function displayTopMovies() {
    try {
        const container = document.querySelector(".top-movies");
        container.innerHTML = `<p class="text-center font-bold text-2xl w-full">Loading...</p>`;

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
                            <span class="text-6xl font-bold opacity-80 backdrop-blur bg-shadow">${index + 1}</span>
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
        container.innerHTML = `<p class="text-center font-bold text-2xl w-full">Loading...</p>`;

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
                            <span class="text-6xl font-bold opacity-80 backdrop-blur bg-shadow">${index + 1}</span>
                        </div>
                    </div>
                </a>
            </div>`).join("");
    } catch (error) {
        console.error("Error fetching featured movies:", error);
    }
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
    const query = document.getElementById("searchBar").value.trim();
    if (query) {
        window.location.href = `/searchResult.html?search=${query}`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.overflow-x-auto');
    const leftButtons = document.querySelectorAll('.left-nav');
    const rightButtons = document.querySelectorAll('.right-nav');

    leftButtons.forEach((leftButton, index) => {
        leftButton.addEventListener('click', () => {
            const slider = sliders[index]; // Match the slider to the button
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

document.addEventListener("DOMContentLoaded", function () {
    const genreFilter = document.getElementById("genreFilter");
    const languageFilter = document.getElementById("languageFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const yearFilter = document.getElementById("yearFilter");

    // Function to build the API URL based on selected filters
    function buildFilterUrl() {

        let url = `${API_BASE_URL}/api/movies/filter?`;
        const genre = genreFilter.value ? `genre=${genreFilter.value}` : "";
        const language = languageFilter.value ? `language=${languageFilter.value}` : "";
        const rating = ratingFilter.value ? `min_rating=${ratingFilter.value}` : "";
        const year = yearFilter.value ? `min_year=${yearFilter.value.split("-")[0]}&max_year=${yearFilter.value.split("-")[1]}` : "";

        // Combine all selected filters into the URL
        const filters = [genre, language, rating, year].filter(Boolean).join("&");
        url += filters;

        return url;
    }

    // Event listeners for filter changes
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

    // Function to fetch movies based on selected filters
    function fetchMovies() {
        console.log("fetching movies");
        const url = buildFilterUrl();
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Update the movie cards with the filtered data
                updateMovieCards(data.movies);
            })
            .catch(error => console.error("Error fetching movies:", error));
    }

    // Function to update movie cards (you can customize this part)
    function updateMovieCards(movies) {
        const movieContainer = document.querySelector(".featured-movies");
        movieContainer.innerHTML = ""; // Clear existing movie cards

        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("relative", "overflow-hidden", "rounded-xl", "flex-none", "w-[200px]", "sm:w-[260px]", "group", "cursor-pointer");
            movieCard.innerHTML = `
                <img src="${movie.img_src}" alt="${movie.original_title}" class="w-full h-[200px] sm:h-[350px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-105">
                <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                    <div class="flex items-center gap-2">
                        <span class="text-6xl font-bold opacity-80 backdrop-blur bg-shadow">${movie.rank}</span>
                    </div>
                </div>
            `;
            movieContainer.appendChild(movieCard);
        });
    }
});

displayTopMovies();
displayFeaturedMovies();
