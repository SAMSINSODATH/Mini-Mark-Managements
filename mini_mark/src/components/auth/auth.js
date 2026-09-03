// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = {
            username: username,
            email: email,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(user));

        alert("Register successfully!");

        window.location.href = "login.html";
    });
}


// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please register first!");
            return;
        }

        if (email === user.email && password === user.password) {

            localStorage.setItem("isLoggedIn", "true");

            alert("Login successfully!");

            window.location.href = "index.html";

        } else {

            alert("Wrong email or password!");

        }
    });
}