
/* =========================
   LOAD NAVBAR
========================= */

async function loadNavbar() {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;

    try {
        const response = await fetch("./components/navbar.html");

        if (!response.ok) {
            throw new Error("Navbar could not be loaded.");
        }

        placeholder.innerHTML = await response.text();
        initNavbar();
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}

/* =========================
   NAVBAR INTERACTIONS
========================= */

function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".navbar__toggle");
    const menu = document.getElementById("fullscreen-menu");
    const cards = [...document.querySelectorAll(".menu-card")];
    const logo = document.querySelector(".navbar__logo");

    if (!navbar || !toggle || !menu) return;

    let menuOpen = false;
    let savedScrollY = 0;

    function openMenu() {
        if (menuOpen) return;

        savedScrollY = window.scrollY;
        menuOpen = true;

        // Lock background scrolling.
        document.body.style.position = "fixed";
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        navbar.classList.add("is-menu-open");
        toggle.classList.add("is-open");
        menu.classList.add("is-open");

        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");

        menu.removeAttribute("inert");
        menu.setAttribute("aria-hidden", "false");
    }

    function closeMenu() {
        if (!menuOpen) return;

        menuOpen = false;

        navbar.classList.remove("is-menu-open");
        toggle.classList.remove("is-open");
        menu.classList.remove("is-open");

        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");

        if (menu.contains(document.activeElement)) {
            toggle.focus({ preventScroll: true });
        }

        menu.setAttribute("inert", "");
        menu.setAttribute("aria-hidden", "true");

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";

        window.scrollTo({
            top: savedScrollY,
            left: 0,
            behavior: "instant"
        });
    }

    /* HAMBURGER */

    toggle.addEventListener("click", () => {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    /* ESCAPE KEY */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuOpen) {
            closeMenu();
            toggle.focus({ preventScroll: true });
        }
    });

    /* DESKTOP CARD HOVER */

    cards.forEach((card) => {
        card.addEventListener("pointerenter", (event) => {
            if (!menuOpen) return;
            if (window.innerWidth <= 1024) return;
            if (event.pointerType !== "mouse") return;

            cards.forEach((item) => {
                item.classList.remove("is-active");
            });

            card.classList.add("is-active");
        });
    });




    /* MENU NAVIGATION */

    cards.forEach((card) => {
        card.addEventListener("click", (event) => {
            const destination = new URL(card.href);
            const currentPage = new URL(window.location.href);

            const samePage =
                destination.origin === currentPage.origin &&
                destination.pathname === currentPage.pathname;

            if (!samePage) {
                closeMenu();
                return;
            }

            if (destination.hash) {
                const targetId = decodeURIComponent(
                    destination.hash.substring(1)
                );

                const target = document.getElementById(targetId);

                if (target) {
                    event.preventDefault();
                    closeMenu();

                    const scrollToTarget = () => {
                        target.scrollIntoView({
                            behavior: window.matchMedia(
                                "(prefers-reduced-motion: reduce)"
                            ).matches ? "instant" : "smooth",
                            block: "start"
                        });

                        history.replaceState(null, "", destination.hash);
                    };

                    if (document.documentElement.dataset.searchReady === "true") {
                        requestAnimationFrame(scrollToTarget);
                    } else {
                        document.addEventListener(
                            "filmoverse:search-ready",
                            () => {
                                requestAnimationFrame(scrollToTarget);
                            },
                            { once: true }
                        );
                    }
                }
            }
        });
    });


    /* LOGO NAVIGATION */

    if (logo) {
        logo.addEventListener("click", () => {
            if (menuOpen) closeMenu();
        });
    }
}

/* =========================
   LOAD FOOTER
========================= */

async function loadFooter() {
    const placeholder = document.getElementById("footer-placeholder");
    if (!placeholder) return;

    try {
        const response = await fetch("./components/footer.html");

        if (!response.ok) {
            throw new Error("Footer could not be loaded.");
        }

        placeholder.innerHTML = await response.text();
    } catch (error) {
        console.error("Error loading footer:", error);
    }
}

/* =========================
   INITIALIZE COMPONENTS
========================= */

loadNavbar();
loadFooter();
