import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password")
      })
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Registration failed");
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    router.push("/");
  }

  return (
    <main className="auth">
      <h1>Vibe</h1>
      <p>Snap into the vibes</p>
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input name="username" placeholder="Username" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
      <a href="/login">Login instead</a>
    </main>
  );
}
