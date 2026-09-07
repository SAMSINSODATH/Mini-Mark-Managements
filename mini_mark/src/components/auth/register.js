
function register(){
    let name = document.getElementById('name')
    let email = document.getElementById('email')
    let password = document.getElementById('password')
    let cPassword = document.getElementById('confirm_password')

    if (password.value !== cPassword.value) {
        alert("Password does not match!");
        return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]' )
    let user = {
        name : name.value,
        email : email.value,
        password : password.value,
    }
    console.log(user)
    users.push(user)
    localStorage.setItem('users',JSON.stringify(users))
    alert("User Register sucessfully")
    window.location.href='login.html'
}

function login(){
    let email = document.getElementById('email')
    let password = document.getElementById('password')
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    let user = users.find((user) => {
        return user.email == email.value && user.password == password.value
    })
    if(!user){
        alert('You don\'t have permission')
        return
    }
    if(user){
        localStorage.setItem('auth',JSON.stringify(user))
        alert('Login successfully')
    }
    window.location.href="../dashboard/index.html"
}