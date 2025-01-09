const API_BASE_URL = "https://flask-movieverse.onrender.com";

async function fetchData(endpoint) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${API_BASE_URL}/api${endpoint}`);
    }
    return await response.json();
}

async function displayTopMovies() {
    try {
        const container = document.querySelector(".top-movies");
        container.innerHTML = `<p class="text-center font-bold text-2xl w-full">Loading...</p>
        `;
        const movies = await fetchData("/top-movies");

        container.innerHTML = movies.map((movie, index) =>
            ` <div class="relative overflow-hidden rounded-xl flex-none w-[200px] sm:w-[260px] group cursor-pointer">
                <img src="${movie.img_src}"
                    alt="${movie.original_title}"
                    class="w-full h-[315px] sm:h-[350px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-105">
                    <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                        <div class="flex items-center gap-2">
                            <span class="text-6xl font-bold opacity-80 backdrop-blur bg-shadow">${index + 1}</span>
                        </div>
                    </div>
            </div>`).join("");
    } catch (error) {
        console.error("Error fetching top movies:", error);
    }
}

// Fetch and display featured movies
async function displayFeaturedMovies() {
    try {
        const container = document.querySelector(".featured-movies ");
        container.innerHTML = `<p class="text-center font-bold text-2xl w-full">Loading...</p>
        `;
        const movies = await fetchData("/featured-movies");
        container.innerHTML = movies.map((movie, index) =>
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

displayTopMovies();
displayFeaturedMovies();
