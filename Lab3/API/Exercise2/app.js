class User {
    constructor({ name, username, email }) {
        this.name = name;
        this.username = username;
        this.email = email;
    }
}

function displayUserInfo(users) {
    const usersContainer = document.getElementById('users-container');
    usersContainer.innerHTML = '';

    if (users.length === 0) {
        usersContainer.innerHTML = '<p>No users found.</p>';
        return;
    }

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <hr>
        `;
        usersContainer.appendChild(userDiv);
    });
}

async function loadUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        const users = data.map(userData => new User(userData));
        displayUserInfo(users);

        const searchInput = document.getElementById("filtered-name");
        searchInput.addEventListener("keyup", function () {
            const filter = searchInput.value.toLowerCase();
            const filteredUsers = users.filter(user =>
                user.name.toLowerCase().includes(filter)
            );
            displayUserInfo(filteredUsers);
        });

    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

loadUsers();
