import { movieCard, loadingMovieCard, API_BASE_URL } from '../scripts/util.js';

const watchlistContainer = document.getElementById('watchlist');

loadingMovieCard(watchlistContainer);

const fetchWatchList = async () => {
    const userid = localStorage.getItem("userId")
    const res = await fetch(`${API_BASE_URL}/api/user/${userid}`)
    const data = await res.json();
    document.querySelector("#userName").innerText = `${String(data.username).charAt(0).toUpperCase() + String(data.username).slice(1)}'s Watchlist`
    movieCard(watchlistContainer, data.watchlist);

}

fetchWatchList()