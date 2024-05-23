class MovieService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.omdbapi.com/';
    }

    async search(title, type, page) {
        const url = `${this.baseUrl}?apikey=${this.apiKey}&s=${title}&type=${type}&page=${page}`;
        try {
            const response = await axios.get(url);
            if (response.data.Response === 'False') {
                throw new Error('Movie not found!');
            }
            return response.data;
        } catch (error) {
            throw new Error('Error fetching data!');
        }
    }

    async getMovie(movieId) {
        const url = `${this.baseUrl}?apikey=${this.apiKey}&i=${movieId}`;
        try {
            const response = await axios.get(url);
            if (response.data.Response === 'False') {
                throw new Error('Movie details not found!');
            }
            return response.data;
        } catch (error) {
            throw new Error('Error fetching movie details!');
        }
    }
}
class UIHandler {
    constructor() {
        this.currentPage = 1;
        this.currentQuery = '';
        this.currentType = '';
        this.movieService = new MovieService('7b5f120b');
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('searchForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            this.currentQuery = document.getElementById('searchInput').value;
            this.currentType = document.getElementById('type').value;
            this.currentPage = 1;
            await this.searchMovies();
        });

        document.getElementById('moreButton').addEventListener('click', async () => {
            this.currentPage++;
            await this.searchMovies();
        });
    }

    async searchMovies() {
        this.toggleLoading(true);
        try {
            const data = await this.movieService.search(this.currentQuery, this.currentType, this.currentPage);
            this.displayMovies(data);
        } catch (error) {
            this.displayError(error.message);
        } finally {
            this.toggleLoading(false);
        }
    }

    async showDetails(movieId) {
        this.toggleLoading(true, 'details');
        try {
            const data = await this.movieService.getMovie(movieId);
            this.displayDetails(data);
        } catch (error) {
            alert(error.message);
        } finally {
            this.toggleLoading(false, 'details');
        }
    }

    displayMovies(data) {
        const moviesDiv = document.getElementById('movies');
        const moreButton = document.getElementById('moreButton');
        if (this.currentPage === 1) moviesDiv.innerHTML = '';

        data.Search.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.innerHTML = `
                <p><strong>Title:</strong> ${movie.Title}</p>
                <p><strong>Type:</strong> ${movie.Type}</p>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <button onclick="uiHandler.showDetails('${movie.imdbID}')">Details</button>
            `;
            moviesDiv.appendChild(movieDiv);
        });

        if (data.totalResults > this.currentPage * 10) {
            moreButton.style.display = 'block';
        } else {
            moreButton.style.display = 'none';
        }
    }

    displayDetails(data) {
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

    displayError(message) {
        const moviesDiv = document.getElementById('movies');
        moviesDiv.innerHTML = `<p>${message}</p>`;
    }

    toggleLoading(isLoading, section = 'movies') {
        const loadingIcon = document.getElementById(`${section}Loading`);
        loadingIcon.style.display = isLoading ? 'block' : 'none';
    }
}

const uiHandler = new UIHandler();











