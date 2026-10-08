document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("blogPostsGrid")) {
        initBlogPage();
    }
});

let currentCategory = "All";
let searchQuery = "";

function initBlogPage() {
    renderFilteredPosts();


    const categoryContainer = document.getElementById("categoryButtons");
    if (categoryContainer) {
        categoryContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("category-btn")) {
                document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");
                currentCategory = e.target.getAttribute("data-category");
                renderFilteredPosts();
            }
        });
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderFilteredPosts();
        });
    }
}

function renderFilteredPosts() {
    const grid = document.getElementById("blogPostsGrid");
    if (!grid) return;

    let posts = getPosts().filter(p => p.status === "published");

    if (currentCategory !== "All") {
        posts = posts.filter(p => p.category === currentCategory);
    }

    if (searchQuery) {
        posts = posts.filter(p => {
            const inTitle = p.title.toLowerCase().includes(searchQuery);
            const inDesc = p.description.toLowerCase().includes(searchQuery);
            const inCategory = p.category.toLowerCase().includes(searchQuery);
            const inTags = p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchQuery));
            return inTitle || inDesc || inCategory || inTags;
        });
    }

    if (posts.length === 0) {
        grid.innerHTML = `<div class="no-results"><p>No articles found matching your criteria.</p></div>`;
        return;
    }

    grid.innerHTML = posts.map(post => createPostCardHTML(post)).join("");
}