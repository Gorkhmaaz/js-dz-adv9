const omdbApiKey = '7b5f120b';
let currentPage = 1;
let currentQuery = '';
let currentType = '';

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    currentQuery = document.getElementById('searchInput').value;
    currentType = document.getElementById('type').value;
    currentPage = 1;
    await searchMovies();
});

async function searchMovies() {
    const url = `https://www.omdbapi.com/?apikey=${omdbApiKey}&s=${currentQuery}&type=${currentType}&page=${currentPage}`;

    try {
        const response = await axios.get(url);
        if (response.data.Response === 'False') {
            displayError('Movie not found!');
        } else {
            displayMovies(response.data);
        }
    } catch (error) {
        displayError('Error fetching data!');
    }
}

function displayMovies(data) {
    const moviesDiv = document.getElementById('movies');
    const paginationDiv = document.getElementById('pagination');
    moviesDiv.innerHTML = '';
    paginationDiv.innerHTML = '';

    if (data.Search) {
        data.Search.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.innerHTML = `
            <p><strong>Title:</strong> ${movie.Title}</p>
            <p><strong>Type:</strong> ${movie.Type}</p>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <button onclick="showDetails('${movie.imdbID}')">Details</button>
          `;
            moviesDiv.appendChild(movieDiv);
        });

        const totalResults = parseInt(data.totalResults);
        const totalPages = Math.ceil(totalResults / 10);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.addEventListener('click', () => {
                currentPage = i;
                searchMovies();
            });
            paginationDiv.appendChild(button);
        }
    } else {
        displayError('Movie not found!');
    }
}

async function showDetails(id) {
    const url = `https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${id}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        displayDetails(data);
    } catch (error) {
        alert('Error fetching movie details!');
    }
}

function displayDetails(data) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <h2>${data.Title}</h2>
        <p><strong>Year:</strong> ${data.Year}</p>
        <p><strong>Rated:</strong> ${data.Rated}</p>
        <p><strong>Released:</strong> ${data.Released}</p>
        <p><strong>Runtime:</strong> ${data.Runtime}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Writer:</strong> ${data.Writer}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>Language:</strong> ${data.Language}</p>
        <p><strong>Country:</strong> ${data.Country}</p>
        <p><strong>Awards:</strong> ${data.Awards}</p>
        <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
      `;
}

function displayError(message) {
    const moviesDiv = document.getElementById('movies');
    moviesDiv.innerHTML = `<p>${message}</p>`;
}










