function getCurrentUser(){
    return JSON.parse(localStorage.getItem("currentUser"));
}

function getUsers(){
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
}

function getPosts(){
    return JSON.parse(localStorage.getItem("posts")) || [];
}
   function updateFollowCounts() {
  const currentUser = getCurrentUser();

  document.getElementById("followersCount").textContent =
    currentUser.followers ? currentUser.followers.length : 0;

  document.getElementById("followingCount").textContent =
    currentUser.following ? currentUser.following.length : 0;
}

function renderProfile(){
    const currentUser = getCurrentUser();

    if (!currentUser){
        window.location.href = "login.html";
        return;
    }

    document.getElementById("ProfileUsername").textContent = currentUser.username;
    document.getElementById("ProfileEmail").textContent = currentUser.email;
    document.getElementById("ProfileBio").textContent =
      currentUser.bio && currentUser.bio.trim() !== "" ? currentUser.bio : "No bio yet.";
    document.getElementById("ProfileImage").src =
      currentUser.profilePicture || "https://i.pravatar.cc/120?img=3";

    updateFollowCounts();
}

function openEditForm(){
    const currentUser = getCurrentUser();

    document.getElementById("editUsername").value = currentUser.username || "" ;
    document.getElementById("editBio").value = currentUser.bio || "" ;
    document.getElementById("editProfilePicture").value = currentUser.profilePicture || "" ;
    document.getElementById("editProfileSection").classList.remove("hidden");
}

function closeEditForm(){
    document.getElementById("editProfileSection").classList.add("hidden");
    document.getElementById("profileMessage").textContent = "" ;
}

function saveProfileChenges(e){
    e.preventDefault();

    const currentUser = getCurrentUser();
    const users = getUsers();
    const newUsername = document.getElementById("editUsername").value.trim();
    const newBio = document.getElementById("editBio").value.trim();
    const newProfilePicture = document.getElementById("editProfilePicture").value.trim();
    const message = document.getElementById("profileMessage");

    message.style.color = "red";

    if(!newUsername) {
        message.textContent = "Username cannot be empty." ;
        return;
    }

    const usernameExists = users.find( (user) => user.username === newUsername && user.id !== currentUser.id ) ;
    if (usernameExists){
        message.textContent = "This username is already taken." ;
        return;
    }

    const updatedUsers = users.map( (user) => {
        if (user.id === currentUser.id){
            return {
                ...user,
                username: newUsername,
                bio: newBio,
                profilePicture: newProfilePicture || "https://i.pravatar.cc/120?img=3"
            };
        }
        return user;
    });

    const updatedCurrentUser = updatedUsers.find( (user) => user.id === currentUser.id);
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    saveUsers(updatedUsers);
    updateFollowCounts();

    message.style.color = "green";
    message.textContent = "Profile updated successfully.";

    renderProfile();
    setTimeout(()=> {
        closeEditForm();
    }, 1000 );
}

function renderUserPosts(){
    const currentUser = getCurrentUser();
    const posts = getPosts();
    const userPostsContainer = document.getElementById("userPostsContainer");
    if (!currentUser || !userPostsContainer) return;

    const userPosts = posts.filter((post) => post.userId === currentUser.id);

    if (userPosts.length === 0) {
        userPostsContainer.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    userPostsContainer.innerHTML = userPosts
        .slice()
        .reverse()
        .map(
        (post) => `
            <article class="post-card">
            <h3>${currentUser.username}</h3>
            <p>${post.content}</p>
            <small>${post.timestamp || "No date"}</small>
            </article>
         `
        )
        .join("");
}

const editProfileBtn = document.getElementById("editProfileBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editProfileForm = document.getElementById("editProfileForm");

if (editProfileBtn) {
  editProfileBtn.addEventListener("click", openEditForm);
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", closeEditForm);
}

if (editProfileForm) {
  editProfileForm.addEventListener("submit", saveProfileChanges);
}

renderProfile();
renderUserPosts();



