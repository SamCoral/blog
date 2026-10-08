const INITIAL_POSTS = [
    {
        id: 1,
        title: "Getting Started with HTML5",
        description: "Learn the foundational structural markup language of the web.",
        category: "Web Development",
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
        content: "HTML5 is the backbone of modern web sites. In this tutorial, we cover semantic tags like header, main, nav, section, and article. Semantic HTML improves both accessibility for screen readers and search engine optimization (SEO).\n\nStart by structuring your pages with clear, logical sections. Always use appropriate heading tags (H1 through H6) in hierarchical order, provide alt text for images, and utilize form labels for full accessibility.",
        author: "Sam Coral",
        date: "2026-10-01",
        tags: ["HTML", "Web Development", "Beginner"],
        status: "published"
    },
    {
        id: 2,
        title: "CSS Layouts & Responsive Design",
        description: "Master Flexbox, Grid, and media queries for responsive web apps.",
        category: "Web Development",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        content: "Responsive design ensures your site looks stunning on mobile devices, tablets, and wide desktop screens alike. Modern CSS features like Flexbox and CSS Grid allow for dynamic layout structures without relying on heavy frameworks.\n\nKey practices include adopting a mobile-first approach, using fluid units like percentages and REMs, and leveraging CSS variables for global color themes and spacing systems.",
        author: "Sam Coral",
        date: "2026-10-02",
        tags: ["CSS", "Design", "Responsive"],
        status: "published"
    },
    {
        id: 3,
        title: "Introduction to JavaScript ES6+",
        description: "Core concepts of JavaScript, arrow functions, DOM manipulation, and arrays.",
        category: "JavaScript",
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80",
        content: "JavaScript makes web pages interactive. Modern ES6+ features such as const/let, template literals, arrow functions, destructuring, and array methods (map, filter, reduce) make your code cleaner and more efficient.\n\nUnderstanding how the DOM (Document Object Model) works is essential. By attaching event listeners and dynamically updating elements, you can create rich user experiences using only vanilla JS.",
        author: "Sam Coral",
        date: "2026-10-03",
        tags: ["JavaScript", "Programming", "Frontend"],
        status: "published"
    },
    {
        id: 4,
        title: "How I Started Learning Web Development",
        description: "Personal experiences, study routines, and tips for aspiring self-taught developers.",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        content: "Learning web development can feel overwhelming due to the vast ecosystem of tools and frameworks. The secret is consistency: code every day, build real projects, and focus on fundamental HTML, CSS, and plain JavaScript before jumping into frameworks.\n\nDon't let tutorial hell slow you down. Build small projects like calculators, todo lists, and personal blog platforms to cement your understanding.",
        author: "Sam Coral",
        date: "2026-10-04",
        tags: ["Career", "Education", "Lifestyle"],
        status: "published"
    },
    {
        id: 5,
        title: "What is Node.js and How It Works",
        description: "Explore the JavaScript runtime environment on the server side.",
        category: "Programming",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        content: "Node.js allows developers to write backend server code using JavaScript. Built on Google Chrome's V8 engine, Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and ideal for real-time applications.\n\nWith Node.js, frontend developers can expand their skill set into full-stack development using a single programming language across both client and server environments.",
        author: "Sam Coral",
        date: "2026-10-05",
        tags: ["NodeJS", "Backend", "Programming"],
        status: "published"
    },
    {
        id: 6,
        title: "The Future of Artificial Intelligence",
        description: "How machine learning models and AI agents are shaping modern software.",
        category: "AI",
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
        content: "Artificial Intelligence is transforming how developers write code, design user interfaces, and automate complex workflows. From intelligent code completion tools to large language models, AI is accelerating innovation.\n\nUnderstanding how to integrate AI APIs into web applications is quickly becoming an essential skill for modern web engineers.",
        author: "Sam Coral",
        date: "2026-10-06",
        tags: ["AI", "Technology", "Future"],
        status: "published"
    }
];

function getPosts() {
    const posts = localStorage.getItem("blogPosts");
    if (posts) {
        try {
            const parsedPosts = JSON.parse(posts);
            if (Array.isArray(parsedPosts)) return parsedPosts;
        } catch (error) {
            console.warn("Saved posts could not be parsed; using defaults.", error);
        }
    }

    const legacyPosts = localStorage.getItem("techpulse_posts");
    if (legacyPosts) {
        try {
            const parsedLegacyPosts = JSON.parse(legacyPosts);
            if (Array.isArray(parsedLegacyPosts)) {
                savePosts(parsedLegacyPosts);
                return parsedLegacyPosts;
            }
        } catch (error) {
            console.warn("Legacy posts could not be parsed; using defaults.", error);
        }
    }

    savePosts(INITIAL_POSTS);
    return INITIAL_POSTS;
}

function savePosts(posts) {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
}

function getComments() {
    return JSON.parse(localStorage.getItem("blogComments")) || [
        {
            id: 1,
            postId: 1,
            name: "Jane Doe",
            email: "jane@example.com",
            text: "Great introduction! Semantic HTML is often overlooked.",
            date: "2026-10-02",
            parentId: null
        }
    ];
}

function saveComments(comments) {
    localStorage.setItem("blogComments", JSON.stringify(comments));
}

function getReactions() {
    return JSON.parse(localStorage.getItem("blogReactions")) || {
        1: { like: 0, love: 0, amazing: 0, helpful: 0 },
        2: { like: 0, love: 0, amazing: 0, helpful: 0 },
        3: { like: 0, love: 0, amazing: 0, helpful: 0 },
        4: { like: 0, love: 0, amazing: 0, helpful: 0 },
        5: { like: 0, love: 0, amazing: 0, helpful: 0 },
        6: { like: 0, love: 0, amazing: 0, helpful: 0 }
    };
}

function saveReactions(reactions) {
    localStorage.setItem("blogReactions", JSON.stringify(reactions));
}

function getSavedPosts() {
    return JSON.parse(localStorage.getItem("savedPosts")) || [];
}

function saveSavedPosts(savedIds) {
    localStorage.setItem("savedPosts", JSON.stringify(savedIds));
}