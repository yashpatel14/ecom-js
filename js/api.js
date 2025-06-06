// Register user
async function registerUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.trim();
    const msg = document.getElementById("register-msg");
    const form = document.getElementById("register-form");
  
    try {
      const response = await fetch('/register', {  // <-- proxy endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, username })
      });
  
      const data = await response.json();
  
      if (data.success) {
        msg.style.color = 'green';
        msg.textContent = "✅ Registration successful!";
        form.reset();
      } else {
        msg.style.color = 'red';
        msg.textContent = `❌ ${data.message || "Registration failed"}`;
      }
    } catch (error) {
      console.error(error);
      msg.style.color = 'red';
      msg.textContent = "❌ Network error.";
    }
  }
  
  // Login user
  async function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("login-msg");
    const form = document.getElementById("login-form");
  
    try {
      const response = await fetch('/login', {  // <-- proxy endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (data.success) {
        msg.style.color = 'green';
        msg.textContent = "✅ Login successful!";
        form.reset();
      } else {
        msg.style.color = 'red';
        msg.textContent = `❌ ${data.message || "Login failed"}`;
      }
    } catch (error) {
      console.error(error);
      msg.style.color = 'red';
      msg.textContent = "❌ Network error.";
    }
  }
  
  // Check auth
  async function checkAuth() {
    try {
      const response = await fetch('/profile', {  // <-- proxy endpoint
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("✅ User is authenticated:", data.user);
      } else {
        console.log("❌ User not authenticated");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }
  
  window.addEventListener('load', checkAuth);
  