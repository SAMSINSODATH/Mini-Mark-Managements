
function register() {
   
    const frist_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = {
        frist_name: frist_name,
        last_name: last_name,
        gender: gender,
        email: email,
        password: password,
        
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    window.location.href = '../auth/login.html';
}
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((user) => {
        return user.email === email && user.password === password;
    });

    if (!user) {
      console.log('invalid user');
      
        return;
    }
    if (user){
        localStorage.setItem("auth_login", JSON.stringify(user))
        window.location.href = "../index.html"
    }
    
}
