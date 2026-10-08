document.addEventListener("DOMContentLoaded", () => {
    const isAdminPage = document.body.classList.contains("admin-body") || window.location.pathname.includes("/admin/");

    if (!isAdminPage) {
        initTheme();
    }

    initMobileNav();
    

    if (document.getElementById("featuredPostContainer")) {
        renderHomepageContent();
    }
});

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }

    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
        themeBtn.innerText = savedTheme === "dark" ? "☀️" : "🌙";
        themeBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            if (newTheme === "dark") {
                document.documentElement.setAttribute("data-theme", "dark");
            } else {
                document.documentElement.removeAttribute("data-theme");
            }
            
            localStorage.setItem("theme", newTheme);
            themeBtn.innerText = newTheme === "dark" ? "☀️" : "🌙";
            showToast(`Switched to ${newTheme} mode`, "info");
        });
    }
}

function initMobileNav() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("open");
        });
    }
}

function renderHomepageContent() {
    const posts = getPosts().filter(p => p.status === "published");
    const featuredContainer = document.getElementById("featuredPostContainer");
    const latestGrid = document.getElementById("latestPostsGrid");

    if (posts.length === 0) {
        if (featuredContainer) featuredContainer.innerHTML = "<p>No articles found.</p>";
        return;
    }

    const featured = posts[posts.length - 1];
    if (featuredContainer) {
        featuredContainer.innerHTML = `
            <div class="featured-card">
                <img src="${featured.image}" alt="${featured.title}" class="featured-img" loading="lazy">
                <div class="featured-details">
                    <span class="badge">${featured.category}</span>
                    <h2>${featured.title}</h2>
                    <p>${featured.description}</p>
                    <div class="card-meta">
                        <span>By ${featured.author}</span> • <span>${featured.date}</span>
                    </div>
                    <a href="article.html?id=${featured.id}" class="btn btn-primary">Read Article</a>
                </div>
            </div>
        `;
    }

    if (latestGrid) {
        const latest = posts.slice(0, 6).reverse();
        latestGrid.innerHTML = latest.map(post => createPostCardHTML(post)).join("");
    }
}

function createPostCardHTML(post) {
    const comments = getComments().filter(c => c.postId === post.id);
    const reactions = getReactions()[post.id] || { like: 0, love: 0, amazing: 0, helpful: 0 };
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

    return `
        <article class="post-card">
            <img src="${post.image}" alt="${post.title}" class="card-img" loading="lazy">
            <div class="card-body">
                <span class="badge">${post.category}</span>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-desc">${post.description}</p>
                <div class="card-meta">
                    <span>${post.author}</span> • <span>${post.date}</span>
                </div>
                <div class="card-stats">
                    <span>👍 ${totalReactions} reactions</span>
                    <span>💬 ${comments.length} comments</span>
                </div>
                <a href="article.html?id=${post.id}" class="btn btn-outline card-btn">Read More</a>
            </div>
        </article>
    `;
}