const API_BASE_URL = "http://127.0.0.1:5000";

// Function to fetch search results from the API
async function fetchSearchResults(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movie/search?search=${query}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to display search results
async function displaySearchResults() {
    const query = new URLSearchParams(window.location.search).get('search');
    if (!query) {
        console.error("No search query provided.");
        return;
    }

    const movies = await fetchSearchResults(query);
    if (!movies || movies.length === 0) {
        document.getElementById("searchResults").innerHTML = "<p>No results found.</p>";
        return;
    }

    const container = document.querySelector("#searchResults .here");
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

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
    const query = document.getElementById("searchBar").value.trim();
    if (query) {
        window.location.href = `?search=${query}`;
    }
});

// Call the function to display search results
displaySearchResults();