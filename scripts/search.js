import { API_BASE_URL, movieCard } from './util.js';

async function fetchSearchResults(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movie/search?search=${query}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function displaySearchResults() {

    const query = new URLSearchParams(window.location.search).get('search');
    if (!query) {
        console.error("No search query provided.");
        return;
    }

    document.getElementById("searchQuery").innerHTML = query.trim();

    const movies = await fetchSearchResults(query.trim());
    if (!movies || movies.message === "No movies found") {
        document.getElementById("searchResults").innerHTML = `<h2 class="text-3xl text-center mt-32 mx-4  ">No results found for "<strong >${query}</strong>".</h2>`;
        return;
    }
    const container = document.querySelector("#searchResults");

    movieCard(container, movies)
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("searchBar").value.trim();
    if (query) {
        window.location.href = `/searchResult.html?search=${query}`;
    }
});

displaySearchResults();