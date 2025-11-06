fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const posts = data.map(postData => new Post(postData));
        const postManager = new PostManager(posts);
        displayPosts(posts);

        console.log(postManager.findPostById(5));
        console.log(postManager.filterPostsByUserId(2));
    })
    .catch(error => console.error('There was a problem with your fetch operation:', error));

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
        `;
        postsContainer.appendChild(postDiv);
    })
}

class Post {
    constructor({ userId, id, title, body }) {
        this.userId = userId;
        this.id = id;
        this.title = title;
        this.body = body;
    }

    display() {
        return `
            <div class="post">
                <h2>${this.title}</h2>
                <p>${this.body}</p>
            </div>
        `;
    }

    update(data) {
        if (data.title) this.title = data.title;
        if (data.body) this.body = data.body;
    }
}

class PostManager {
    constructor(posts) {
        this.posts = posts;
    }

    findPostById(id) {
        return this.posts.find(post => post.id == id);
    }

    filterPostsByUserId(userId) {
        return this.posts.filter(post => post.userId === userId);
    }

    updatePost(id, newData) {
        const post = this.findPostById(id);
        if (post) {
            post.update(newData);
            console.log(`Post ${id} updated.`);
        } else {
            console.log(`Post ${id} not found.`)
        }
    }

    deletePost(id) {
        const initialLength = this.posts.length;
        this.posts = this.posts.filter(post => post.id !== id);
        if (this.posts.length < initialLength) {
            console.log(`Post ${id} deleted.`);
        } else {
            console.log(`Post ${id} not found.`)
        }
    }
}