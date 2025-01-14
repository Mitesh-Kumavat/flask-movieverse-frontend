
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
