const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createElement(initial = {}) {
    const listeners = {};
    return {
        ...initial,
        addEventListener(type, handler) {
            listeners[type] = handler;
        },
        dispatch(type) {
            listeners[type]?.({ preventDefault() {} });
        },
        classList: {
            add() {},
            remove() {},
            toggle() {},
        },
        focus() {},
        reset() {},
    };
}

function createContext() {
    const storage = new Map();
    const elements = new Map();
    const element = (id, defaults = {}) => createElement(defaults);

    const ids = [
        'themeToggle', 'postForm', 'editorPageTitle', 'postId', 'postTitle',
        'postCategory', 'postAuthor', 'postImage', 'imagePreview', 'previewImg',
        'postDescription', 'postContent', 'postTags', 'saveDraftBtn',
        'toastContainer',
    ];

    for (const id of ids) {
        elements.set(id, element(id));
    }

    elements.get('postCategory').value = 'Programming';
    elements.get('postAuthor').value = 'Test Admin';
    elements.get('postImage').value = 'https://example.com/post.jpg';
    elements.get('postDescription').value = 'A post created through the admin flow.';
    elements.get('postContent').value = 'This content should appear in the public blog.';
    elements.get('postTags').value = 'Testing, Admin';
    elements.get('postForm').value = '';
    elements.get('toastContainer').appendChild = () => {};
    elements.get('toastContainer').removeChild = () => {};

    const listeners = {};
    const document = {
        body: {
            classList: { contains() { return false; } },
            setAttribute() {},
        },
        documentElement: { setAttribute() {}, removeAttribute() {} },
        getElementById(id) {
            return elements.get(id) || null;
        },
        querySelector() { return null; },
        createElement() {
            return {
                className: '',
                textContent: '',
                classList: { add() {}, remove() {} },
            };
        },
        addEventListener(type, handler) {
            listeners[type] = handler;
        },
    };

    const context = {
        console,
        document,
        window: {
            location: { search: '', pathname: '/admin/create-post.html' },
            matchMedia: () => ({ matches: false }),
        },
        localStorage: {
            getItem(key) { return storage.has(key) ? storage.get(key) : null; },
            setItem(key, value) { storage.set(key, String(value)); },
            removeItem(key) { storage.delete(key); },
        },
        URLSearchParams,
        setTimeout() {},
        clearTimeout() {},
    };

    context.globalThis = context;
    vm.createContext(context);

    const projectRoot = path.resolve(__dirname, '..');
    vm.runInContext(fs.readFileSync(path.join(projectRoot, 'js/data.js'), 'utf8'), context);
    vm.runInContext(fs.readFileSync(path.join(projectRoot, 'js/admin.js'), 'utf8'), context);
    listeners.DOMContentLoaded?.();

    return {
        context,
        elements,
        storage,
    };
}

const { context, elements } = createContext();
const postForm = elements.get('postForm');
const titleInput = elements.get('postTitle');

// Simulate the complete admin form submission.
titleInput.value = 'Admin-created visible post';
postForm.dispatch('submit');

const posts = context.getPosts();
const createdPost = posts.find(post => post.title === 'Admin-created visible post');
assert.ok(createdPost, 'Admin-created post must be available through the public getPosts() API');
assert.equal(createdPost.status, 'Published');
assert.equal(createdPost.author, 'Test Admin');

console.log('Admin post flow test passed: created post is visible through the shared data API.');
