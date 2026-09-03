const loginForm = document.getElementById("loginForm");

const username = document.getElementById("username");
const password = document.getElementById("password");

const message = document.getElementById("message");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();

    // Check empty input
    if (usernameValue === "" || passwordValue === "") {
        message.textContent = "Please enter username and password.";
        message.style.color = "red";
        return;
    }

    // Example login
    if (usernameValue === "customer" && passwordValue === "12345") {

        message.textContent = "Login successful!";
        message.style.color = "green";

        // Save login status
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("username", usernameValue);

        // Go to home page
        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);

    } else {

        message.textContent = "Invalid username or password.";
        message.style.color = "red";
    }

});