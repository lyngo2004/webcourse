class Post {
    constructor({ userId, id, title, body }) {
        this.userId = userId;
        this.id = id;
        this.title = title;
        this.body = body;
    }
}

class PostManager {
    constructor(posts) {
        this.posts = posts;
    }
    numberOfPosts() {
        return this.posts.length;
    }
    avgPostTitleLength() {
        const totalLength = this.posts.reduce((sum, post) => sum + post.title.length, 0);
        return totalLength / this.posts.length;
    }
    getPostsByUser(userId) {
        return this.posts.filter(post => post.userId === userId);
    }
}

function displayStatistic(postManager) {
    const statisticsContainer = document.getElementById('statistics-container');
    const postDiv = document.createElement('div');
    postDiv.innerHTML = `
        <p>Total Posts: ${postManager.numberOfPosts()}</p>
        <p>Average Post Title Length: ${postManager.avgPostTitleLength().toFixed(2)}</p>
        <p>Posts by User 1: ${postManager.getPostsByUser(1).length}</p>
    `;
    statisticsContainer.appendChild(postDiv);
}

async function loadPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        const posts = data.map(postData => new Post(postData));
        const postManager = new PostManager(posts);
        displayStatistic(postManager);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

loadPosts();