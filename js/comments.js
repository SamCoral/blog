/* ==========================================================================
   Comments & Nesting Reply Module
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("commentsList")) {
        initComments();
    }
});

function initComments() {
    renderComments();

    const commentForm = document.getElementById("commentForm");
    if (commentForm) {
        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("commentName").value.trim();
            const email = document.getElementById("commentEmail").value.trim();
            const text = document.getElementById("commentText").value.trim();

            if (!name || !email || !text) {
                showToast("Please fill in all comment fields", "info");
                return;
            }

            const comments = getComments();
            const newComment = {
                id: Date.now(),
                postId: currentArticleId,
                name: name,
                email: email,
                text: text,
                date: new Date().toISOString().split("T")[0],
                parentId: null
            };

            comments.push(newComment);
            saveComments(comments);
            commentForm.reset();
            renderComments();
            showToast("Comment posted successfully", "success");
        });
    }
}

function renderComments() {
    const list = document.getElementById("commentsList");
    const header = document.getElementById("commentsHeader");
    if (!list) return;

    const allComments = getComments().filter(c => c.postId === currentArticleId);
    if (header) header.innerText = `Comments (${allComments.length})`;

    const parentComments = allComments.filter(c => c.parentId === null);

    if (parentComments.length === 0) {
        list.innerHTML = "<p class='no-comments'>No comments yet. Be the first to share your thoughts!</p>";
        return;
    }

    list.innerHTML = parentComments.map(parent => {
        const replies = allComments.filter(c => c.parentId === parent.id);
        return `
            <div class="comment-card">
                <div class="comment-header">
                    <strong>${escapeHTML(parent.name)}</strong>
                    <span class="comment-date">${parent.date}</span>
                </div>
                <p class="comment-text">${escapeHTML(parent.text)}</p>
                <button class="btn-reply" onclick="toggleReplyForm(${parent.id})">Reply</button>

                <div id="replyForm-${parent.id}" class="reply-form-container hidden">
                    <form onsubmit="submitReply(event, ${parent.id})">
                        <input type="text" id="replyName-${parent.id}" placeholder="Your Name" required>
                        <input type="email" id="replyEmail-${parent.id}" placeholder="Your Email" required>
                        <textarea id="replyText-${parent.id}" rows="2" placeholder="Write a reply..." required></textarea>
                        <button type="submit" class="btn btn-primary btn-sm">Submit Reply</button>
                    </form>
                </div>

                ${replies.length > 0 ? `
                    <div class="replies-list">
                        ${replies.map(reply => `
                            <div class="comment-card reply-card">
                                <div class="comment-header">
                                    <strong>${escapeHTML(reply.name)}</strong>
                                    <span class="comment-date">${reply.date}</span>
                                </div>
                                <p class="comment-text">${escapeHTML(reply.text)}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join("");
}

function toggleReplyForm(commentId) {
    const form = document.getElementById(`replyForm-${commentId}`);
    if (form) form.classList.toggle("hidden");
}

function submitReply(e, parentId) {
    e.preventDefault();
    const name = document.getElementById(`replyName-${parentId}`).value.trim();
    const email = document.getElementById(`replyEmail-${parentId}`).value.trim();
    const text = document.getElementById(`replyText-${parentId}`).value.trim();

    if (!name || !email || !text) {
        showToast("Please fill in all fields", "info");
        return;
    }

    const comments = getComments();
    comments.push({
        id: Date.now(),
        postId: currentArticleId,
        name: name,
        email: email,
        text: text,
        date: new Date().toISOString().split("T")[0],
        parentId: parentId
    });

    saveComments(comments);
    renderComments();
    showToast("Reply added", "success");
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}