

import { fetchFromSanity } from "./sanity-client.js";

// =========================
// HELPERS
// =========================

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value ?? "";
}

function formatRuntime(minutes) {
  if (minutes == null) return "";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} h`;

  return `${hours} h ${remainingMinutes} min`;
}

// =========================
// LOAD TITLE FROM SANITY
// =========================

async function loadTitle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    console.error("Missing title slug.");
    return;
  }

  try {
    const title = await fetchFromSanity(`
      *[_type == "movie" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        contentType,
        summary,
        genres,
        year,
        runtime,
        episodes,
        imdbRating,
        trailerUrl,
        paragraphOne,
        paragraphTwo,
        paragraphThree,
        credits,
        "heroUrl": heroImage.asset->url + "?w=1920&auto=format&q=80"
      }
    `, { slug });

    if (!title) {
      console.error("Movie or TV show not found.");
      return;
    }

    renderTitle(title);
    loadRelatedTitles(title);

  } catch (error) {
    console.error("Failed to load title:", error);
  }
}

// =========================
// RENDER TITLE PAGE
// =========================

function renderTitle(title) {
  const heroImage = document.getElementById("title-hero-image");

  if (heroImage && title.heroUrl) {
    heroImage.fetchPriority = "high";
    heroImage.loading = "eager";
    heroImage.src = title.heroUrl;
    heroImage.alt = title.name;
  }

  setText("title-name", title.name);
  setText("title-summary", title.summary);
  setText("title-year", title.year);
  setText("title-rating", title.imdbRating ?? "N/A");

  // Runtime for movies, episode count for TV shows
  const duration = title.contentType === "series"
    ? `${title.episodes} episodes`
    : formatRuntime(title.runtime);

  setText("title-runtime", duration);

  // Trailer
  const trailer = document.getElementById("title-trailer");

  if (trailer) {
    if (title.trailerUrl) {
      trailer.href = title.trailerUrl;
      trailer.hidden = false;
    } else {
      trailer.hidden = true;
    }
  }

  // Genres
  renderGenres(title.genres || []);

  // Story paragraphs
  setText("title-description-one", title.paragraphOne);
  setText("title-description-two", title.paragraphTwo);
  setText("title-description-three", title.paragraphThree);

  // Creators and Cast
  setText("title-directors", title.credits?.directors);
  setText("title-writers", title.credits?.writers);
  setText("title-stars", title.credits?.stars);

  // Page title and SEO
  document.title = `${title.name} | Filmoverse`;

  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  if (description) description.content = title.summary || "";
  if (ogTitle) ogTitle.content = `${title.name} | Filmoverse`;
  if (ogDescription) ogDescription.content = title.summary || "";
}

// =========================
// RENDER GENRES
// =========================

function renderGenres(genres) {
  const container = document.getElementById("title-genres");

  if (!container) return;

  container.innerHTML = "";

  genres.forEach((genre, index) => {
    if (index > 0) {
      const separator = document.createElement("span");
      separator.className = "title-hero__separator";
      separator.textContent = "|";
      container.append(separator);
    }

    const link = document.createElement("a");

    link.href = `index.html?genre=${encodeURIComponent(genre.toLowerCase())}#search`;
    link.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);

    container.append(link);
  });
}

// =========================
// LOAD RELATED MOVIES / SERIES
// =========================

async function loadRelatedTitles(currentTitle) {
  const heading = document.getElementById("title-related-heading");

  if (heading) {
    heading.textContent = currentTitle.contentType === "series"
      ? "Related TV Shows"
      : "Related Movies";
  }

  try {
    const related = await fetchFromSanity(`
      *[
        _type == "movie" &&
        contentType == $contentType &&
        _id != $currentId
      ] | order(year desc, name asc)[0...10] {
        _id,
        name,
        slug,
        year,
        imdbRating,
        "coverUrl": coverImage.asset->url
      }
    `, {
      contentType: currentTitle.contentType,
      currentId: currentTitle._id
    });

    renderRelatedTitles(related || []);

  } catch (error) {
    console.error("Failed to load related titles:", error);
  }
}

// =========================
// RENDER RELATED CARDS
// =========================

function renderRelatedTitles(titles) {
  const container = document.getElementById("title-related-grid");

  if (!container) return;

  container.innerHTML = "";

  for (const movie of titles) {
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

    const name = document.createElement("h3");
    name.className = "movie-card__title";
    name.textContent = movie.name;

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
    card.append(image, name, details);

    container.append(card);
  }
}

// =========================
// INITIAL LOAD
// =========================

loadTitle();
