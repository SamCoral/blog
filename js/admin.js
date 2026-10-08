document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Theme Toggle Logic (Light / Dark Mode)
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    applyTheme(currentTheme);
    updateToggleIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateToggleIcon(currentTheme);
        });
    }

    function applyTheme(theme) {
        const nextTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        document.body.setAttribute('data-theme', nextTheme);
    }

    function updateToggleIcon(theme) {
        if (themeToggleBtn) {
            themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    const currentPath = window.location.pathname;
    if (currentPath.endsWith('/admin/dashboard.html')) {
        initAdminDashboard();
    } else if (currentPath.endsWith('/admin/login.html')) {
        initAdminLogin();
    }

    // ----------------------------------------------------------------------
    // 2. Editor Form Elements & URL Params Initialization
    // ----------------------------------------------------------------------
    const postForm = document.getElementById('postForm');
    const pageTitle = document.getElementById('editorPageTitle');
    const postIdInput = document.getElementById('postId');
    const titleInput = document.getElementById('postTitle');
    const categorySelect = document.getElementById('postCategory');
    const authorInput = document.getElementById('postAuthor');
    const imageInput = document.getElementById('postImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const descInput = document.getElementById('postDescription');
    const contentInput = document.getElementById('postContent');
    const tagsInput = document.getElementById('postTags');
    const saveDraftBtn = document.getElementById('saveDraftBtn');

    // Check if we are editing an existing article via URL ?id=XXX
    const urlParams = new URLSearchParams(window.location.search);
    const editingId = urlParams.get('id');

    if (editingId) {
        loadArticleForEditing(editingId);
    }

    // ----------------------------------------------------------------------
    // 3. Featured Image Live Preview
    // ----------------------------------------------------------------------
    imageInput?.addEventListener('input', () => {
        const url = imageInput.value.trim();
        if (url) {
            previewImg.src = url;
            imagePreview.classList.remove('hidden');
        } else {
            imagePreview.classList.add('hidden');
        }
    });

    previewImg?.addEventListener('error', () => {
        imagePreview.classList.add('hidden');
    });

    // ----------------------------------------------------------------------
    // 4. Form Submission (Publish)
    // ----------------------------------------------------------------------
    postForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveArticle('Published');
    });

    // Save Draft
    saveDraftBtn?.addEventListener('click', () => {
        if (!titleInput.value.trim()) {
            showToast('Please enter an article title to save as draft.', 'error');
            titleInput.focus();
            return;
        }
        saveArticle('Draft');
    });

    // ----------------------------------------------------------------------
    // 5. Functions: Save & Load Articles
    // ----------------------------------------------------------------------
    function saveArticle(status) {
        const posts = getPosts();
        const existingId = postIdInput.value ? Number(postIdInput.value) : null;
        const id = Number.isFinite(existingId) ? existingId : Date.now();

        const postData = {
            id: id,
            title: titleInput.value.trim(),
            category: categorySelect.value,
            author: authorInput.value.trim(),
            image: imageInput.value.trim(),
            description: descInput.value.trim(),
            content: contentInput.value.trim(),
            tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean),
            status: status,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        const existingIndex = posts.findIndex(p => p.id === id);

        if (existingIndex > -1) {
            posts[existingIndex] = postData;
        } else {
            posts.unshift(postData);
        }

        savePosts(posts);
        showToast(`Article successfully ${status === 'Draft' ? 'saved as draft' : 'published'}!`, 'success');

        // Redirect back to dashboard after 1.2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1200);
    }

    function loadArticleForEditing(id) {
        const posts = getPosts();
        const post = posts.find(p => String(p.id) === String(id));

        if (!post) {
            showToast('Article not found!', 'error');
            return;
        }

        pageTitle.textContent = 'Edit Article';
        postIdInput.value = post.id;
        titleInput.value = post.title || '';
        categorySelect.value = post.category || '';
        authorInput.value = post.author || '';
        imageInput.value = post.image || '';
        descInput.value = post.description || '';
        contentInput.value = post.content || '';
        tagsInput.value = Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '';

        if (post.image) {
            previewImg.src = post.image;
            imagePreview.classList.remove('hidden');
        }
    }

    // Toast Notification helper
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function initAdminLogin() {
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (sessionStorage.getItem('techpulseAdmin') === 'true') {
            window.location.href = 'dashboard.html';
            return;
        }

        loginForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value;

            if (username === 'admin' && password === 'admin123') {
                sessionStorage.setItem('techpulseAdmin', 'true');
                showToast('Welcome back! Opening dashboard.', 'success');
                window.location.href = 'dashboard.html';
            } else {
                showToast('Incorrect username or password.', 'error');
            }
        });
    }

    function initAdminDashboard() {
        if (sessionStorage.getItem('techpulseAdmin') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        const logoutButton = document.getElementById('logoutBtn');
        logoutButton?.addEventListener('click', () => {
            sessionStorage.removeItem('techpulseAdmin');
            window.location.href = 'login.html';
        });

        renderAdminDashboard();
    }

    function renderAdminDashboard() {
        const posts = getPosts();
        const comments = getComments();
        const reactions = getReactions();
        const allReactionCounts = Object.values(reactions).reduce((total, postReactions) => {
            return total + Object.values(postReactions).reduce((sum, count) => sum + Number(count || 0), 0);
        }, 0);

        document.getElementById('statTotalPosts').textContent = posts.length;
        document.getElementById('statPublishedPosts').textContent = posts.filter(post => post.status === 'published').length;
        document.getElementById('statDraftPosts').textContent = posts.filter(post => post.status === 'draft').length;
        document.getElementById('statTotalComments').textContent = comments.length;
        document.getElementById('statTotalReactions').textContent = allReactionCounts;

        const table = document.getElementById('adminPostsTable');
        table.innerHTML = posts.map(post => {
            const postComments = comments.filter(comment => Number(comment.postId) === Number(post.id)).length;
            const postReactions = reactions[String(post.id)] || {};
            const reactionCount = Object.values(postReactions).reduce((sum, count) => sum + Number(count || 0), 0);
            const statusClass = post.status === 'draft' ? 'draft' : 'published';

            return `
                <tr>
                    <td><strong>${escapeHTML(post.title)}</strong></td>
                    <td>${escapeHTML(post.category || 'Uncategorized')}</td>
                    <td>${escapeHTML(post.date || '—')}</td>
                    <td><span class="badge badge-${statusClass}">${escapeHTML(post.status || 'draft')}</span></td>
                    <td>${postComments}</td>
                    <td>${reactionCount}</td>
                    <td>
                        <a href="create-post.html?id=${encodeURIComponent(post.id)}" class="action-btn">Edit</a>
                        <button class="action-btn delete-btn" type="button" data-delete-id="${encodeURIComponent(post.id)}">Delete</button>
                    </td>
                </tr>`;
        }).join('');

        table.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('[data-delete-id]');
            if (!deleteButton) return;

            const postId = deleteButton.dataset.deleteId;
            const post = posts.find(item => String(item.id) === postId);
            if (!post || !window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;

            const nextPosts = posts.filter(item => String(item.id) !== postId);
            savePosts(nextPosts);
            renderAdminDashboard();
            showToast('Article deleted.', 'success');
        });
    }

    function escapeHTML(value) {
        return String(value || '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
});