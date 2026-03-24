function followUser(targetId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.id === targetId) return;

  const targetUser = users.find((u) => u.id === targetId);
  if (!targetUser) return;

  currentUser.following = currentUser.following || [];
  targetUser.followers = targetUser.followers || [];

  if (!currentUser.following.includes(targetId)) {
    currentUser.following.push(targetId);
    targetUser.followers.push(currentUser.id);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
}

function unfollowUser(targetId) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.id === targetId) return;

  const targetUser = users.find((u) => u.id === targetId);
  if (!targetUser) return;

  currentUser.following =
    currentUser.following?.filter((id) => id !== targetId) || [];
  targetUser.followers =
    targetUser.followers?.filter((id) => id !== currentUser.id) || [];

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function isFollowing(targetId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser?.following?.includes(targetId) || false;
}
