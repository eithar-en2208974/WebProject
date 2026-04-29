const profileInfo = document.getElementById("profileInfo");
const userPosts = document.getElementById("userPosts");

async function loadProfile() {
  const currentUser = requireCurrentUser();
  const [{ user }, { posts }] = await Promise.all([
    apiRequest(`/api/users/${currentUser.id}`),
    apiRequest(`/api/posts?authorId=${currentUser.id}&sortBy=createdAt&order=desc`)
  ]);

  profileInfo.innerHTML = `
    <h2>${user.username}</h2>
    <p>${user.email}</p>
    <p>${user._count.posts} posts | ${user._count.followers} followers | ${user._count.following} following</p>
  `;

  userPosts.innerHTML = "";
  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <p>${post.text}</p>
      <p>${new Date(post.createdAt).toLocaleString()}</p>
    `;
    userPosts.appendChild(div);
  });
}

loadProfile().catch((error) => {
  profileInfo.innerHTML = `<p>${error.message}</p>`;
});
