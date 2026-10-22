const signInButton = document.querySelector("#google-sign-in");
const errorMessage = document.querySelector("#sign-in-error");
const signInUrl = "http://localhost:3000/api/auth/sign-in/social";

function setLoading(isLoading) {
  signInButton.disabled = isLoading;
  signInButton.classList.toggle("is-loading", isLoading);
  signInButton.setAttribute("aria-busy", String(isLoading));
  signInButton.querySelector(".button-label").textContent = isLoading
    ? "Connecting to Google..."
    : "Continue with Google";
}

signInButton.addEventListener("click", async () => {
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  setLoading(true);

  try {
    const response = await fetch(signInUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        provider: "google",
        callbackURL: "http://localhost:5500/success.html",
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        `The authentication server returned an invalid response (${response.status}).`,
      );
    }

    if (!response.ok || !data.url) {
      throw new Error(data.message || "Unable to start Google sign-in");
    }

    window.location.href = data.url;
  } catch (error) {
    console.error(error);
    errorMessage.textContent =
      error instanceof TypeError
        ? "Could not reach the authentication server. Check that it is running and that CORS allows http://localhost:5500."
        : error.message || "Unable to start Google sign-in. Please try again.";
    errorMessage.hidden = false;
    setLoading(false);
  }
});
