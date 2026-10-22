const sessionUrl = "http://localhost:3000/api/auth/get-session";
const signOutUrl = "http://localhost:3000/api/auth/sign-out";

const statusIcon = document.querySelector("#status-icon");
const statusTitle = document.querySelector("#status-title");
const statusMessage = document.querySelector("#status-message");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const sessionError = document.querySelector("#session-error");
const signOutButton = document.querySelector("#sign-out");
const backToSignIn = document.querySelector("#back-to-sign-in");

function showError(message) {
  sessionError.textContent = message;
  sessionError.hidden = false;
}

function showSignedOut(message = "You are not logged in") {
  statusIcon.classList.remove("is-loading");
  statusIcon.textContent = "!";
  statusIcon.style.background = "#fff5e8";
  statusIcon.style.color = "#ad6b12";
  statusTitle.textContent = message;
  statusMessage.textContent = "Sign in with Google to continue.";
  signOutButton.hidden = true;
  backToSignIn.hidden = false;
}

async function loadSession() {
  try {
    const response = await fetch(sessionUrl, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Session check failed (${response.status}).`);
    }

    const data = await response.json();
    if (!data?.user) {
      showSignedOut();
      return;
    }

    statusIcon.classList.remove("is-loading");
    statusIcon.textContent = "✓";
    statusTitle.textContent = "Login Successful!";
    statusMessage.textContent = "";
    statusMessage.hidden = true;
    userName.textContent = `Welcome, ${data.user.name || "there"}`;
    userName.hidden = false;
    userEmail.textContent = data.user.email || "Email address unavailable";
    userEmail.hidden = false;
    signOutButton.hidden = false;
    signOutButton.disabled = false;
  } catch (error) {
    console.error(error);
    statusIcon.classList.remove("is-loading");
    statusIcon.textContent = "!";
    statusIcon.style.background = "#fff5e8";
    statusIcon.style.color = "#ad6b12";
    statusTitle.textContent = "Unable to check your session";
    statusMessage.textContent =
      "The authentication server could not confirm your sign-in.";
    showError(
      error instanceof TypeError
        ? "Could not reach the authentication server. Check that it is running and allows credentials from http://localhost:5500."
        : error.message || "Please try again.",
    );
    backToSignIn.hidden = false;
  }
}

signOutButton.addEventListener("click", async () => {
  sessionError.hidden = true;
  signOutButton.disabled = true;
  signOutButton.textContent = "Signing out...";

  try {
    const response = await fetch(signOutUrl, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      let message = `Sign out failed (${response.status}).`;
      try {
        const data = await response.json();
        if (data.message) message = data.message;
      } catch {
        // Keep the HTTP status message when the response has no JSON body.
      }
      throw new Error(message);
    }

    window.location.replace("./index.html");
  } catch (error) {
    console.error(error);
    showError(
      error instanceof TypeError
        ? "Could not reach the authentication server. Check its CORS settings and try again."
        : error.message || "Unable to sign out. Please try again.",
    );
    signOutButton.disabled = false;
    signOutButton.textContent = "Sign Out";
  }
});

loadSession();
