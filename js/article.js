let currentArticleId = null;

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("articleContent")) {
        initArticlePage();
        initReadingProgressBar();
    }
});

function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    currentArticleId = parseInt(params.get("id")) || 1;

    const posts = getPosts();
    const article = posts.find(p => p.id === currentArticleId);

    if (!article) {
        document.getElementById("articleContent").innerHTML = `<h2>Article Not Found</h2><a href="blog.html">Return to Blog</a>`;
        return;
    }

    const wordCount = article.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const articleContainer = document.getElementById("articleContent");
    articleContainer.innerHTML = `
        <header class="article-header">
            <span class="badge">${article.category}</span>
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span>By <strong>${article.author}</strong></span> • 
                <span>${article.date}</span> • 
                <span>📖 ${readingTime} min read</span>
            </div>
        </header>
        <img src="${article.image}" alt="${article.title}" class="article-hero-img">
        <div class="article-body">
            ${article.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}
        </div>
        <div class="article-tags">
            ${(article.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}
        </div>
    `;

    initBookmarkButton();
    updateReactionDisplay();
    bindReactionHandlers();
    renderRelatedPosts(article);
}

function initReadingProgressBar() {
    const progressBar = document.getElementById("progressBar");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    });
}

function initBookmarkButton() {
    const btn = document.getElementById("bookmarkBtn");
    if (!btn) return;

    let saved = getSavedPosts();
    let isSaved = saved.includes(currentArticleId);

    const updateBtnUI = () => {
        btn.innerText = isSaved ? "🔖 Article Saved" : "🔖 Save Article";
        btn.classList.toggle("btn-saved", isSaved);
    };

    updateBtnUI();

    btn.addEventListener("click", () => {
        saved = getSavedPosts();
        if (isSaved) {
            saved = saved.filter(id => id !== currentArticleId);
            showToast("Removed from saved bookmarks", "info");
        } else {
            saved.push(currentArticleId);
            showToast("Article saved successfully", "success");
        }
        saveSavedPosts(saved);
        isSaved = !isSaved;
        updateBtnUI();
    });
}


function updateReactionDisplay() {
    const allReactions = getReactions();
    const articleReactions = allReactions[currentArticleId] || { like: 0, love: 0, amazing: 0, helpful: 0 };

    document.getElementById("likeCount").innerText = articleReactions.like || 0;
    document.getElementById("loveCount").innerText = articleReactions.love || 0;
    document.getElementById("amazingCount").innerText = articleReactions.amazing || 0;
    document.getElementById("helpfulCount").innerText = articleReactions.helpful || 0;
}

function bindReactionHandlers() {
    const buttons = document.querySelectorAll(".reaction-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const reactionType = btn.getAttribute("data-reaction");
            const userVotesKey = `voted_${currentArticleId}_${reactionType}`;

            if (localStorage.getItem(userVotesKey)) {
                showToast("You have already reacted with this emoji", "info");
                return;
            }

            const allReactions = getReactions();
            if (!allReactions[currentArticleId]) {
                allReactions[currentArticleId] = { like: 0, love: 0, amazing: 0, helpful: 0 };
            }

            allReactions[currentArticleId][reactionType] = (allReactions[currentArticleId][reactionType] || 0) + 1;
            saveReactions(allReactions);
            localStorage.setItem(userVotesKey, "true");

            updateReactionDisplay();
            showToast("Reaction recorded!", "success");
        });
    });
}

function renderRelatedPosts(currentArticle) {
    const grid = document.getElementById("relatedPostsGrid");
    if (!grid) return;

    const related = getPosts()
        .filter(p => p.status === "published" && p.id !== currentArticle.id && p.category === currentArticle.category)
        .slice(0, 3);

    if (related.length === 0) {
        grid.innerHTML = "<p>No related articles found in this category.</p>";
        return;
    }

    grid.innerHTML = related.map(post => createPostCardHTML(post)).join("");
}