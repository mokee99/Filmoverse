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

loadFooter();