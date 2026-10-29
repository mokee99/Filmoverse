
const thumbsSwiper = new Swiper(".thumbs-swiper", {
  slidesPerView: "auto",
  spaceBetween: 12,
  watchSlidesProgress: true,
  slideToClickedSlide: false,

  breakpoints: {
    768: {
      spaceBetween: 16,
    },
    992: {
      spaceBetween: 24,
    },
  },
});

const heroSwiper = new Swiper(".hero-swiper", {
  slidesPerView: 1,
  effect: "fade",

  fadeEffect: {
    crossFade: true,
  },

  loop: true,

  autoplay: {
    delay: 10000,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },

  thumbs: {
    swiper: thumbsSwiper,
    autoScrollOffset: 1,
  },
});






import { fetchFromSanity } from './sanity-client.js';

// =========================
// SEARCH SECTION
// =========================

const moviesContainer = document.querySelector("#movies-container");
const searchInput = document.querySelector("#movie-search");
const typeButtons = document.querySelectorAll(".search-type");
const genreButtons = document.querySelectorAll(".genre-button");
const loadMoreButton = document.querySelector("#load-more-button");

const ITEMS_PER_PAGE = 20;

let allMovies = [];
let filteredMovies = [];
let visibleCount = ITEMS_PER_PAGE;

let selectedType = null;
let selectedGenre = null;
let trendingOnly = false;
let searchQuery = "";

// =========================
// LOAD MOVIES FROM SANITY
// =========================

async function loadMovies() {
  try {
    const movies = await fetchFromSanity(`
      *[_type == "movie"] | order(year desc, name asc) {
        _id,
        name,
        slug,
        contentType,
        year,
        imdbRating,
        genres,
        trending,
        "coverUrl": coverImage.asset->url
      }
    `);

    allMovies = movies;
    applyFilters();

  } catch (error) {
    console.error("Failed to load movies:", error);
  }
}

// =========================
// FILTER MOVIES
// =========================

function applyFilters() {
  filteredMovies = allMovies.filter((movie) => {
    const matchesType = !selectedType || movie.contentType === selectedType;

    const matchesGenre = !selectedGenre ||
      (movie.genres || []).some((genre) =>
        genre.toLowerCase() === selectedGenre.toLowerCase()
      );

    const matchesTrending = !trendingOnly || movie.trending === true;

    const matchesSearch = movie.name
      .toLowerCase()
      .includes(searchQuery);

    return matchesType && matchesGenre && matchesTrending && matchesSearch;
  });

  visibleCount = ITEMS_PER_PAGE;
  renderMovies();
  updateLoadMore();
}

// =========================
// RENDER MOVIE CARDS
// =========================

function renderMovies() {
  moviesContainer.innerHTML = "";

  const visibleMovies = filteredMovies.slice(0, visibleCount);

  for (const movie of visibleMovies) {
    const card = document.createElement("a");
    card.className = "movie-card";

    if (movie.slug?.current) {
      card.href = `movie.html?slug=${encodeURIComponent(movie.slug.current)}`;
    } else {
      card.removeAttribute("href");
    }

    const image = document.createElement("img");
    image.className = "movie-card__image";
    image.src = movie.coverUrl || "";
    image.alt = movie.name;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.className = "movie-card__title";
    title.textContent = movie.name;

    const details = document.createElement("div");
    details.className = "movie-card__details";

    const year = document.createElement("span");
    year.className = "movie-card__year";
    year.textContent = movie.year ?? "";

    const rating = document.createElement("div");
    rating.className = "movie-card__rating";

    const star = document.createElement("img");
    star.src = "./assets/icons/star-icon.svg";
    star.alt = "";
    star.setAttribute("aria-hidden", "true");

    const ratingValue = document.createElement("span");
    ratingValue.textContent = movie.imdbRating ?? "N/A";

    rating.append(star, ratingValue);
    details.append(year, rating);
    card.append(image, title, details);
    moviesContainer.append(card);
  }
}

// =========================
// LOAD MORE
// =========================

function updateLoadMore() {
  loadMoreButton.hidden = visibleCount >= filteredMovies.length;
}

loadMoreButton.addEventListener("click", () => {
  visibleCount += ITEMS_PER_PAGE;
  renderMovies();
  updateLoadMore();
});

// =========================
// SEARCH INPUT
// =========================

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim().toLowerCase();
  applyFilters();
});

// =========================
// CONTENT TYPE & TRENDING
// =========================

typeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.type;

    if (type === "trending") {
      trendingOnly = !trendingOnly;
    } else {
      selectedType = selectedType === type ? null : type;
    }

    typeButtons.forEach((item) => {
      const itemType = item.dataset.type;

      const isActive = itemType === "trending"
        ? trendingOnly
        : selectedType === itemType;

      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    applyFilters();
  });
});

// =========================
// GENRE FILTERS
// =========================

genreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const genre = button.dataset.genre;

    selectedGenre = selectedGenre === genre ? null : genre;

    genreButtons.forEach((item) => {
      const isActive = item.dataset.genre === selectedGenre;

      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    applyFilters();
  });
});

// =========================
// INITIAL LOAD
// =========================

loadMovies();