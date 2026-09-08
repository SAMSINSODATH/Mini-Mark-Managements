
function register() {
    // Get values directly
    const frist_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // const role = document.getElementById('role').value; // Reads selected option value

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = {
        frist_name: frist_name,
        last_name: last_name,
        gender: gender,
        email: email,
        password: password,
        // role: role 
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    window.location.href = '../auth/login.html';
}
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Option A: Use 'return' explicitly with curly braces
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
    // checkRole(user);
}
// function checkRole(user){
//     if (user.role === 'admin'){
//          window.location.href = '../admin/dashboard.html'
//     }else if (user.role === 'staff'){
//         window.location.href = '../staff/index.html'
//     }else if(user.role == 'user'){
//         window.location.href ="../user/user.html"
//     }
//     else{
//         window.location.href = '../index.html'
//     }
       
// }