const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check password
    if (password !== confirmPassword) {

        message.textContent =
            "❌ Passwords do not match";

        message.style.color = "red";

        return;
    }


    // Get existing users
    let users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );


    // Check email
    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {

        message.textContent =
            "❌ Email is already registered";

        message.style.color = "red";

        return;
    }


    // Create customer
    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        password: password

    };


    // Add customer
    users.push(newUser);


    // Save customer
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // Show success
    message.textContent =
        "✅ Registration successful!";

    message.style.color = "green";


    // Clear form
    registerForm.reset();


    // Go to login
    setTimeout(function () {

        window.location.href = "login.html";

    }, 1000);

});