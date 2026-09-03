// ===============================
// MINI MART AUTH.JS
// REGISTER + LOGIN
// ===============================


// Get users
let users = JSON.parse(
    localStorage.getItem("miniMartUsers") || "[]"
);


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");


        // Check empty
        if (
            name === "" ||
            username === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            message.textContent =
                "Please fill in all fields.";

            message.style.color = "red";

            return;
        }


        // Password length
        if (password.length < 6) {

            message.textContent =
                "Password must be at least 6 characters.";

            message.style.color = "red";

            return;
        }


        // Confirm password
        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            message.style.color = "red";

            return;
        }


        // Check username
        const usernameExists = users.some(function (user) {

            return user.username.toLowerCase() ===
                   username.toLowerCase();

        });


        if (usernameExists) {

            message.textContent =
                "Username already exists.";

            message.style.color = "red";

            return;
        }


        // Check email
        const emailExists = users.some(function (user) {

            return user.email.toLowerCase() ===
                   email.toLowerCase();

        });


        if (emailExists) {

            message.textContent =
                "Email already exists.";

            message.style.color = "red";

            return;
        }


        // New customer
        const newUser = {

            id: Date.now(),

            name: name,

            username: username,

            email: email,

            password: password

        };


        // Save customer
        users.push(newUser);

        localStorage.setItem(
            "miniMartUsers",
            JSON.stringify(users)
        );


        message.textContent =
            "Registration successful!";

        message.style.color = "green";


        registerForm.reset();


        // Go to login
        setTimeout(function () {

            window.location.href = "login.html";

        }, 1000);

    });

}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const username =
            document.getElementById("loginUsername")
            .value
            .trim();

        const password =
            document.getElementById("loginPassword")
            .value;

        const message =
            document.getElementById("loginMessage");


        // Check empty
        if (username === "" || password === "") {

            message.textContent =
                "Please enter username and password.";

            message.style.color = "red";

            return;
        }


        // Find customer
        const user = users.find(function (user) {

            return (
                user.username.toLowerCase() ===
                username.toLowerCase() &&
                user.password === password
            );

        });


        // Login success
        if (user) {

            localStorage.setItem(
                "miniMartLogin",
                "true"
            );

            localStorage.setItem(
                "miniMartCurrentUser",
                JSON.stringify(user)
            );


            message.textContent =
                "Welcome to Mini Mart!";

            message.style.color = "green";


            setTimeout(function () {

                window.location.href = "index.html";

            }, 1000);

        } else {

            message.textContent =
                "Invalid username or password.";

            message.style.color = "red";

        }

    });

}