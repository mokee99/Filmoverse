
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
      card.href = `title.html?slug=${encodeURIComponent(movie.slug.current)}`;
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
// GENRE FILTER FROM URL
// =========================

function applyGenreFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const genre = params.get("genre");

  if (!genre) return;

  const matchingButton = [...genreButtons].find(
    button => button.dataset.genre.toLowerCase() === genre.toLowerCase()
  );

  if (!matchingButton) return;

  selectedGenre = matchingButton.dataset.genre;

  matchingButton.classList.add("is-active");
  matchingButton.setAttribute("aria-pressed", "true");
}

// =========================
// INITIAL LOAD
// =========================

applyGenreFromUrl();
loadMovies();


// =========================
// TOP 10 MOVIES & SERIES
// =========================

async function loadTopTen() {
  try {
    const topMovies = await fetchFromSanity(`
      *[_type == "movie" && contentType == "movie" && defined(imdbRating)]
      | order(imdbRating desc, name asc)[0...10] {
        name,
        slug,
        "coverUrl": coverImage.asset->url
      }
    `);

    const topSeries = await fetchFromSanity(`
      *[_type == "movie" && contentType == "series" && defined(imdbRating)]
      | order(imdbRating desc, name asc)[0...10] {
        name,
        slug,
        "coverUrl": coverImage.asset->url
      }
    `);

    renderTopTen(topMovies, "#top-movies-container");
    renderTopTen(topSeries, "#top-series-container");

    initTopTenSwipers();

  } catch (error) {
    console.error("Failed to load Top 10:", error);
  }
}

// =========================
// RENDER TOP 10 POSTERS
// =========================

function renderTopTen(items, containerSelector) {
  const container = document.querySelector(containerSelector);

  if (!container) return;

  container.innerHTML = "";

  for (const item of items) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const link = document.createElement("a");

    if (item.slug?.current) {
      link.href = `title.html?slug=${encodeURIComponent(item.slug.current)}`;
    }

    const image = document.createElement("img");
    image.src = item.coverUrl || "";
    image.alt = item.name;
    image.loading = "lazy";

    link.append(image);
    slide.append(link);
    container.append(slide);
  }
}

// =========================
// INITIALIZE SWIPERS
// =========================

function initTopTenSwipers() {
  const swiperOptions = {
    slidesPerView: 2,
    spaceBetween: 16,
    speed: 600,
    watchOverflow: true,
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 16
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 16
      }
    }
  };

  new Swiper(".top-movies-swiper", {
    ...swiperOptions,
    navigation: {
      nextEl: ".top-movies-next"
    }
  });

  new Swiper(".top-series-swiper", {
    ...swiperOptions,
    navigation: {
      nextEl: ".top-series-next"
    }
  });
}

// =========================
// INITIAL LOAD
// =========================

loadTopTen();


// =========================
// HOT SECTION
// =========================

async function loadHot() {
  try {
    const hotTitles = await fetchFromSanity(`
      *[_type == "movie" && hot == true] {
        name,
        slug,
        contentType,
        year,
        imdbRating,
        runtime,
        episodes,
        genres,
        summary,
        "backgroundUrl": heroImage.asset->url
      }
    `);

    renderHot(hotTitles);
    initHotSwiper();

  } catch (error) {
    console.error("Failed to load Hot section:", error);
  }
}

// =========================
// RENDER HOT SLIDES
// =========================

function renderHot(items) {
  const container = document.querySelector("#hot-container");

  if (!container) return;

  container.innerHTML = "";

  for (const item of items) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const card = document.createElement("article");
    card.className = "hot-card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "hot-card__image";

    const image = document.createElement("img");
    image.src = item.backgroundUrl || "";
    image.alt = item.name;
    image.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "hot-card__overlay";

    imageWrapper.append(image, overlay);

    const content = document.createElement("div");
    content.className = "hot-card__content";

    const meta = document.createElement("div");
    meta.className = "hot-card__meta";

    const metaItems = [
      item.imdbRating != null ? `IMDb ${item.imdbRating}` : null,
      item.year,
      item.contentType === "series" ? item.episodes : item.runtime,
      ...(item.genres || []).slice(0, 2)
    ].filter(Boolean);

    meta.textContent = metaItems.join(" | ");

    const details = document.createElement("div");
    details.className = "hot-card__details";

    const title = document.createElement("h2");
    title.className = "hot-card__title";
    title.textContent = item.name;

    const summary = document.createElement("p");
    summary.className = "hot-card__summary";
    summary.textContent = item.summary || "";

    const button = document.createElement("a");
    button.className = "hot-card__button";
    button.textContent = "Explore";

    if (item.slug?.current) {
      button.href = `title.html?slug=${encodeURIComponent(item.slug.current)}`;
    }

    details.append(title, summary, button);
    content.append(meta, details);
    card.append(imageWrapper, content);
    slide.append(card);
    container.append(slide);
  }
}

// =========================
// INITIALIZE HOT SWIPER
// =========================

function initHotSwiper() {
  new Swiper(".hot-swiper", {
    slidesPerView: 1,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    loop: true,
    speed: 800,
    autoplay: {
      delay: 8000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false
    }
  });
}

// =========================
// INITIAL LOAD
// =========================

loadHot();



// =========================
// BLOG SLIDER SECTION
// =========================

async function loadBlogSlider() {
  try {
    const blogs = await fetchFromSanity(`
      *[_type == "blogPost"] | order(_createdAt desc)[0...4] {
        _id,
        title,
        slug,
        summarySlider,
        "imageUrl": thumbnailImage.asset->url
      }
    `);

    if (!blogs.length) return;

    renderBlogSlider(blogs);
    initBlogSwiper(blogs);

  } catch (error) {
    console.error("Failed to load Blog Slider:", error);
  }
}

// =========================
// RENDER BLOG SLIDES
// =========================

function renderBlogSlider(blogs) {
  const container = document.querySelector("#blog-slider-container");

  if (!container) return;

  container.innerHTML = "";

  for (const blog of blogs) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const image = document.createElement("img");
    image.src = blog.imageUrl || "";
    image.alt = blog.title;
    image.loading = "lazy";

    slide.append(image);
    container.append(slide);
  }
}

// =========================
// UPDATE ACTIVE BLOG CONTENT
// =========================

function updateActiveBlog(blogs, index) {
  const blog = blogs[index];

  if (!blog) return;

  const title = document.querySelector("#blog-active-title");
  const summary = document.querySelector("#blog-active-summary");
  const link = document.querySelector("#blog-active-link");

  title.textContent = blog.title;
  summary.textContent = blog.summarySlider || "";

  if (blog.slug?.current) {
    link.href = `article.html?slug=${encodeURIComponent(blog.slug.current)}`;
  } else {
    link.removeAttribute("href");
  }
}

// =========================
// INITIALIZE BLOG SWIPER
// =========================

function initBlogSwiper(blogs) {
  const container = document.querySelector("#blog-slider-container");

  if (!container || !blogs.length) return;

  // Duplicate the original slides for a seamless loop
  const originalSlides = Array.from(container.children);

  originalSlides.forEach((slide) => {
    container.append(slide.cloneNode(true));
  });

  new Swiper(".blog-swiper", {
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    speed: 600,
    grabCursor: false,
    allowTouchMove: false,
    slideToClickedSlide: false,
    watchSlidesProgress: true,

    navigation: {
      nextEl: ".blog-slider__next",
      prevEl: ".blog-slider__prev"
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 0,
        allowTouchMove: true
      },
      992: {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 0,
        allowTouchMove: false
      }
    },

    on: {
      init: function () {
        updateActiveBlog(blogs, this.realIndex % blogs.length);
      },

      realIndexChange: function () {
        updateActiveBlog(blogs, this.realIndex % blogs.length);
      }
    }
  });
}

// =========================
// INITIAL LOAD
// =========================

loadBlogSlider();