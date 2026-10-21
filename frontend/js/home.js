import { fetchFromSanity } from './sanity-client.js';

async function loadMovies() {
  try {
    const movies = await fetchFromSanity(`
      *[_type == "movie"] {
        name,
        year,
        imdbRating,
        genres,
        "coverUrl": coverImage.asset->url
      }
    `);

    const container = document.querySelector('#movies-container');

    if (!container) {
      console.error('Movies container not found.');
      return;
    }

    for (const movie of movies) {
      const card = document.createElement('div');
      const image = document.createElement('img');
      const title = document.createElement('h3');
      const year = document.createElement('p');
      const rating = document.createElement('p');
      const genres = document.createElement('p');

      if (movie.coverUrl) {
        image.src = movie.coverUrl;
        image.alt = movie.name;
        card.append(image);
      }

      title.textContent = movie.name;
      year.textContent = movie.year;
      rating.textContent = `IMDb: ${movie.imdbRating}`;
      genres.textContent = movie.genres.join(', ');

      card.append(title, year, rating, genres);
      container.append(card);
    }

  } catch (error) {
    console.error('Failed to load movies:', error);
  }
}

loadMovies();