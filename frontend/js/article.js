
import { fetchFromSanity } from "./sanity-client.js";

/* =========================
   HELPERS
========================= */

function setText(id, value) {
  const element = document.getElementById(id);
  if (!element) return;

  element.textContent = value || "";
}

function setImage(id, url, alt) {
  const image = document.getElementById(id);
  if (!image) return;

  if (url) {
    image.src = url;
    image.alt = alt || "";
  }
}

function formatGenre(genre) {
  if (!genre) return "";

  return genre.charAt(0).toUpperCase() + genre.slice(1);
}

/* =========================
   LOAD ARTICLE
========================= */

async function loadArticle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    console.error("Article slug is missing.");
    return;
  }

  try {
    const article = await fetchFromSanity(
      `*[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        readingTime,
        genres,

        introHeading,
        introParagraph,

        "heroDesktop": heroImage.asset->url,
        "heroTablet": heroImageTablet.asset->url,
        "heroMobile": heroImageMobile.asset->url,

        sectionOneHeadingOne,
        sectionOneParagraphOne,
        sectionOneHeadingTwo,
        sectionOneParagraphTwo,
        "sectionOneImageUrl": sectionOneImage.asset->url,

        sectionTwoHeadingOne,
        sectionTwoParagraphOne,
        sectionTwoHeadingTwo,
        sectionTwoParagraphTwo,
        "sectionTwoImageUrl": sectionTwoImage.asset->url,

        sectionThreeHeadingOne,
        sectionThreeParagraphOne,
        sectionThreeHeadingTwo,
        sectionThreeParagraphTwo,
        "sectionThreeImageUrl": sectionThreeImage.asset->url
      }`,
      { slug }
    );

    if (!article) {
      console.error("Article not found:", slug);
      return;
    }

    renderArticle(article);
    await loadRelatedPosts(article._id);

  } catch (error) {
    console.error("Failed to load article:", error);
  }
}

/* =========================
   RENDER ARTICLE
========================= */

function renderArticle(article) {

  // HERO TEXT
  setText("article-title", article.introHeading);
  setText("article-intro", article.introParagraph);

  // HERO IMAGES
  setImage(
    "article-hero-desktop",
    article.heroDesktop,
    article.introHeading
  );

  const tabletSource = document.getElementById("article-hero-tablet");
  const mobileSource = document.getElementById("article-hero-mobile");

  if (tabletSource) {
    tabletSource.srcset = article.heroTablet || article.heroDesktop || "";
  }

  if (mobileSource) {
    mobileSource.srcset = article.heroMobile || article.heroTablet || article.heroDesktop || "";
  }

  // META
  setText(
    "article-reading-time",
    `${article.readingTime} min read`
  );

  renderGenres(article.genres);

  // SECTION ONE
  setText("section-one-heading-one", article.sectionOneHeadingOne);
  setText("section-one-paragraph-one", article.sectionOneParagraphOne);
  setText("section-one-heading-two", article.sectionOneHeadingTwo);
  setText("section-one-paragraph-two", article.sectionOneParagraphTwo);

  setImage(
    "section-one-image",
    article.sectionOneImageUrl,
    article.sectionOneHeadingTwo
  );

  // SECTION TWO
  setText("section-two-heading-one", article.sectionTwoHeadingOne);
  setText("section-two-paragraph-one", article.sectionTwoParagraphOne);
  setText("section-two-heading-two", article.sectionTwoHeadingTwo);
  setText("section-two-paragraph-two", article.sectionTwoParagraphTwo);

  setImage(
    "section-two-image",
    article.sectionTwoImageUrl,
    article.sectionTwoHeadingTwo
  );

  // SECTION THREE
  setText("section-three-heading-one", article.sectionThreeHeadingOne);
  setText("section-three-paragraph-one", article.sectionThreeParagraphOne);
  setText("section-three-heading-two", article.sectionThreeHeadingTwo);
  setText("section-three-paragraph-two", article.sectionThreeParagraphTwo);

  setImage(
    "section-three-image",
    article.sectionThreeImageUrl,
    article.sectionThreeHeadingTwo
  );

  // PAGE METADATA
  document.title = `${article.title} | Filmoverse`;

  const description = document.querySelector('meta[name="description"]');

  if (description) {
    description.content = article.introParagraph || "";
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');

  if (ogTitle) ogTitle.content = `${article.title} | Filmoverse`;
  if (ogDescription) ogDescription.content = article.introParagraph || "";
  if (ogImage && article.heroDesktop) ogImage.content = article.heroDesktop;
  if (ogUrl) ogUrl.content = window.location.href;
}

/* =========================
   RENDER GENRES
========================= */

function renderGenres(genres) {
  const container = document.getElementById("article-genres");
  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(genres)) return;

  genres.forEach((genre) => {
    const span = document.createElement("span");
    span.className = "article-meta__genre";
    span.textContent = formatGenre(genre);

    container.appendChild(span);
  });
}

/* =========================
   RELATED POSTS
========================= */

async function loadRelatedPosts(currentArticleId) {
  try {
    const posts = await fetchFromSanity(
      `*[_type == "blogPost" && _id != $currentId]
        | order(_createdAt desc)[0...3] {
          _id,
          title,
          slug,
          readingTime,
          "imageUrl": thumbnailImageRelated.asset->url
        }`,
      { currentId: currentArticleId }
    );

    renderRelatedPosts(posts || []);

  } catch (error) {
    console.error("Failed to load related posts:", error);
  }
}

function renderRelatedPosts(posts) {
  const container = document.getElementById("related-posts-grid");
  if (!container) return;

  container.innerHTML = "";

  posts.forEach((post) => {
    const link = document.createElement("a");
    link.className = "related-post-card";
    link.href = `article.html?slug=${encodeURIComponent(post.slug.current)}`;

    const image = document.createElement("img");
    image.className = "related-post-card__image";
    image.src = post.imageUrl || "";
    image.alt = post.title || "";
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.className = "related-post-card__title";
    title.textContent = post.title || "";

    const time = document.createElement("span");
    time.className = "related-post-card__time";
    time.textContent = `${post.readingTime} min read`;

    link.append(image, title, time);
    container.appendChild(link);
  });
}

/* =========================
   INITIALIZE
========================= */

loadArticle();
