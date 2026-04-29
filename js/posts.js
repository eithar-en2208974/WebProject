const postBtn = document.getElementById("postBtn");

if (postBtn) {
  postBtn.addEventListener("click", async function () {
    try {
      const text = document.getElementById("postText").value.trim();
      const user = requireCurrentUser();
      if (!text) return;

      await apiRequest("/api/posts", {
        method: "POST",
        body: JSON.stringify({ authorId: user.id, text })
      });

      await loadFeed();
      document.getElementById("postText").value = "";
    } catch (error) {
      alert(error.message);
    }
  });
}

async function deletePost(id) {
  try {
    await apiRequest(`/api/posts/${id}`, { method: "DELETE" });
    await loadFeed();
  } catch (error) {
    alert(error.message);
  }
}
