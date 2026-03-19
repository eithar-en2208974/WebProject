const postContent = document.getElementById("postContent");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("postsContainer");

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

function savePosts(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function renderPosts() {
    const posts = getPosts();
    const currentUser = getCurrentUser();

    postsContainer.innerHTML = "";

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet.</p>";
        return;
    }
    posts.slice().reverse().forEach((post) => {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");

        postCard.innerHTML = `
         <div class="post-header">
         <div>
           <div class="post-user">${post.username}</div>
           <div class="post-time">${formatDate(post.timestamp)}</div>
         </div> 
         ${
            currentUser && currentUser.username === post.username
            ? `<button class="delete-btn" data-id="${post.id}">Delete</button>`
            : ""
         }
         </div>
         <p class="post-text">${post.content}</p>
         `;
     postsContainer.appendChild(postCard);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
            deletePost(Number(this.dataset.id));
        });


    });
}

function createPost() {
    const content = postContent.value.trim();
    const currentUser = getCurrentUser();

    if (!content) {
        alert("Post cannot be empty.");
        return;
    }
    if (!currentUser) {
        alert("No user is logged in.");
        return;
    }

    const posts = getPosts(); 

    const newPost = {
        id: Date.now(), 
        username: currentUser.username ,
        content: content , 
        timestamp: new Date().toISOString()
    };

    posts.push(newPost);
    savePosts(posts);
    postContent.value = ""; 
    renderPosts(); 
}
function deletePost(postId) {
    let posts = getPosts();
    posts = posts.filter((post) => post.id !== postId);
    savePosts(posts);
    renderPosts();
}

postBtn.addEventListener("click", createPost);
renderPosts();