const nextAppUrl = "http://localhost:3004";

if (location.origin !== nextAppUrl) {
  const fileName = location.pathname.split("/").pop();
  const routes = {
    "index.html": "/",
    "login.html": "/login",
    "register.html": "/register",
    "profile.html": "/profile"
  };
  const nextPath = routes[fileName] || "/";

  location.href = nextAppUrl + nextPath;
}
