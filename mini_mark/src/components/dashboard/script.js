/* =====================================================
    MINI MARKET MANAGEMENT SYSTEM
    HTML + CSS + JAVASCRIPT + LOCAL STORAGE
===================================================== */


/* =====================================================
    DATABASE
===================================================== */

let users = JSON.parse(
    localStorage.getItem("users") || "[]"
);

let products = JSON.parse(
    localStorage.getItem("products") || "[]"
);

let customers = JSON.parse(
    localStorage.getItem("customers") || "[]"
);

let sales = JSON.parse(
    localStorage.getItem("sales") || "[]"
);

let cart = [];

let currentUser =
    JSON.parse(
        localStorage.getItem("currentUser") || "null"
    );


/* =====================================================
   SAVE DATABASE
===================================================== */

function saveData() {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );
}


/* =====================================================
   CREATE DEFAULT ADMIN
===================================================== */

function createDefaultAdmin() {

    if (users.length === 0) {

        users.push({

            id: 1,

            first_name: "Admin",

            last_name: "User",

            email: "admin@gmail.com",

            password: "123456",

            role: "admin"

        });

        saveData();
    }
}


/* =====================================================
   PAGE START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createDefaultAdmin();

        if (currentUser) {

            showSystem();

        } else {

            showLogin();

        }

        updateDashboard();

    }
);


/* =====================================================
   LOGIN / REGISTER
===================================================== */

function showLogin() {

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("registerPage")
        .classList.add("hidden");

    document
        .getElementById("systemPage")
        .classList.add("hidden");
}


function showRegister() {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("registerPage")
        .classList.remove("hidden");
}


function showSystem() {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("registerPage")
        .classList.add("hidden");

    document
        .getElementById("systemPage")
        .classList.remove("hidden");

    document.getElementById(
        "currentUser"
    ).innerText =
        currentUser.first_name +
        " " +
        currentUser.last_name +
        " (" +
        currentUser.role +
        ")";

    showPage("dashboard");
}


/* =====================================================
   REGISTER
===================================================== */

document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            let firstName =
                document.getElementById(
                    "registerFirstName"
                ).value.trim();

            let lastName =
                document.getElementById(
                    "registerLastName"
                ).value.trim();

            let email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();

            let password =
                document.getElementById(
                    "registerPassword"
                ).value;

            let role =
                document.getElementById(
                    "registerRole"
                ).value;


            let existingUser =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            if (existingUser) {

                alert(
                    "This email is already registered!"
                );

                return;
            }


            let newUser = {

                id: Date.now(),

                first_name: firstName,

                last_name: lastName,

                email: email,

                password: password,

                role: role

            };


            users.push(newUser);

            saveData();


            alert(
                "Registration successful!"
            );


            document
                .getElementById("registerForm")
                .reset();


            showLogin();

        }
    );


/* =====================================================
   LOGIN
===================================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            let password =
                document.getElementById(
                    "loginPassword"
                ).value;


            let user =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                            email.toLowerCase()
                        &&
                        user.password === password
                );


            if (!user) {

                alert(
                    "Invalid email or password!"
                );

                return;
            }


            currentUser = user;


            localStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );


            showSystem();

        }
    );


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    if (
        confirm(
            "Are you sure you want to logout?"
        )
    ) {

        localStorage.removeItem(
            "currentUser"
        );

        currentUser = null;

        cart = [];

        showLogin();

    }
}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(page) {

    let pages =
        document.querySelectorAll(
            ".content-page"
        );

    pages.forEach(
        p =>
            p.classList.add("hidden")
    );


    let selected =
        document.getElementById(
            page + "Page"
        );


    if (selected) {

        selected.classList.remove(
            "hidden"
        );

    }


    let titles = {

        dashboard: "Dashboard",

        products: "Product Management",

        sales: "Point of Sale",

        customers: "Customer Management",

        inventory: "Inventory",

        reports: "Reports"

    };


    document.getElementById(
        "pageTitle"
    ).innerText =
        titles[page] || page;


    if (page === "dashboard") {

        updateDashboard();

    }

    if (page === "products") {

        displayProducts();

    }

    if (page === "sales") {

        displayPOSProducts();

        displayCart();

    }

    if (page === "customers") {

        displayCustomers();

    }

    if (page === "inventory") {

        displayInventory();

    }

    if (page === "reports") {

        displayReports();

    }
}


/* =====================================================
   PRODUCT MANAGEMENT
===================================================== */

document
    .getElementById("productForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let id =
                document.getElementById(
                    "productId"
                ).value;


            let name =
                document.getElementById(
                    "productName"
                ).value.trim();

            let category =
                document.getElementById(
                    "productCategory"
                ).value.trim();

            let price =
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                );

            let stock =
                Number(
                    document.getElementById(
                        "productStock"
                    ).value
                );


            if (id) {

                let product =
                    products.find(
                        p =>
                            p.id ==
                            Number(id)
                    );


                if (product) {

                    product.name =
                        name;

                    product.category =
                        category;

                    product.price =
                        price;

                    product.stock =
                        stock;

                }


                alert(
                    "Product updated successfully!"
                );

            } else {

                let newProduct = {

                    id: Date.now(),

                    name: name,

                    category: category,

                    price: price,

                    stock: stock

                };


                products.push(
                    newProduct
                );


                alert(
                    "Product added successfully!"
                );
            }


            saveData();

            clearProductForm();

            displayProducts();

            updateDashboard();

        }
    );


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts() {

    let table =
        document.getElementById(
            "productsTable"
        );


    let search =
        document.getElementById(
            "productSearch"
        ).value.toLowerCase();


    let filtered =
        products.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(search)
                ||
                product.category
                    .toLowerCase()
                    .includes(search)
        );


    table.innerHTML = "";


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No products found
                </td>
            </tr>
        `;

        return;
    }


    filtered.forEach(
        product => {

            let status = "";

            if (product.stock === 0) {

                status = `
                    <span class="status status-out">
                        Out of Stock
                    </span>
                `;

            } else if (product.stock <= 5) {

                status = `
                    <span class="status status-low">
                        Low Stock
                    </span>
                `;

            } else {

                status = `
                    <span class="status status-good">
                        Available
                    </span>
                `;

            }


            table.innerHTML += `

                <tr>

                    <td>${product.id}</td>

                    <td>${product.name}</td>

                    <td>${product.category}</td>

                    <td>$${product.price.toFixed(2)}</td>

                    <td>${product.stock}</td>

                    <td>${status}</td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editProduct(${product.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteProduct(${product.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(id) {

    let product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    document.getElementById(
        "productId"
    ).value =
        product.id;


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productCategory"
    ).value =
        product.category;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productStock"
    ).value =
        product.stock;


    document.getElementById(
        "productSubmit"
    ).innerText =
        "Update Product";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   CLEAR PRODUCT FORM
===================================================== */

function clearProductForm() {

    document
        .getElementById("productForm")
        .reset();


    document.getElementById(
        "productId"
    ).value = "";


    document.getElementById(
        "productSubmit"
    ).innerText =
        "Add Product";

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(id) {

    if (
        !confirm(
            "Delete this product?"
        )
    ) {

        return;
    }


    products =
        products.filter(
            product =>
                product.id !== id
        );


    saveData();

    displayProducts();

    updateDashboard();

}


/* =====================================================
   POS PRODUCTS
===================================================== */

function displayPOSProducts() {

    let container =
        document.getElementById(
            "posProductList"
        );


    let search =
        document.getElementById(
            "posSearch"
        ).value.toLowerCase();


    let filtered =
        products.filter(
            product =>
                product.stock > 0
                &&
                product.name
                    .toLowerCase()
                    .includes(search)
        );


    container.innerHTML = "";


    filtered.forEach(
        product => {

            container.innerHTML += `

                <div
                    class="product-item"
                    onclick="addToCart(${product.id})"
                >

                    <h4>
                        ${product.name}
                    </h4>

                    <small>
                        ${product.category}
                    </small>

                    <p>
                        $${product.price.toFixed(2)}
                    </p>

                    <small>
                        Stock: ${product.stock}
                    </small>

                </div>

            `;

        }
    );

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    let product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    let existing =
        cart.find(
            item =>
                item.productId === id
        );


    if (existing) {

        if (
            existing.quantity <
            product.stock
        ) {

            existing.quantity++;

        } else {

            alert(
                "Not enough stock!"
            );

            return;
        }

    } else {

        cart.push({

            productId: id,

            quantity: 1

        });

    }


    displayCart();

}


/* =====================================================
   DISPLAY CART
===================================================== */

function displayCart() {

    let container =
        document.getElementById(
            "cartItems"
        );


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML =
            "<p>Cart is empty</p>";

        calculateCart();

        return;
    }


    cart.forEach(
        item => {

            let product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (!product) return;


            let total =
                product.price *
                item.quantity;


            container.innerHTML += `

                <div class="cart-item">

                    <div>

                        <strong>
                            ${product.name}
                        </strong>

                        <br>

                        ${item.quantity}
                        ×
                        $${product.price.toFixed(2)}

                    </div>

                    <div>

                        $${total.toFixed(2)}

                        <button
                            onclick="removeFromCart(${product.id})"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;

        }
    );


    calculateCart();

}


/* =====================================================
   REMOVE CART ITEM
===================================================== */

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.productId !== id
        );


    displayCart();

}


/* =====================================================
   CALCULATE CART
===================================================== */

function calculateCart() {

    let subtotal = 0;


    cart.forEach(
        item => {

            let product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (product) {

                subtotal +=
                    product.price *
                    item.quantity;

            }

        }
    );


    let discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    let total =
        subtotal - discount;


    if (total < 0) {

        total = 0;

    }


    document.getElementById(
        "cartSubtotal"
    ).innerText =
        subtotal.toFixed(2);


    document.getElementById(
        "cartTotal"
    ).innerText =
        total.toFixed(2);

}


/* =====================================================
   COMPLETE SALE
===================================================== */

function completeSale() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;
    }


    let subtotal = 0;


    cart.forEach(
        item => {

            let product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (product) {

                subtotal +=
                    product.price *
                    item.quantity;

            }

        }
    );


    let discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    let total =
        subtotal - discount;


    if (total < 0) {

        total = 0;

    }


    let payment =
        Number(
            document.getElementById(
                "payment"
            ).value
        );


    if (
        isNaN(payment)
        ||
        payment < total
    ) {

        alert(
            "Payment is not enough!"
        );

        return;
    }


    let customer =
        document.getElementById(
            "saleCustomer"
        ).value.trim()
        ||
        "Walk-in Customer";


    let change =
        payment - total;


    /* REDUCE STOCK */

    cart.forEach(
        item => {

            let product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (product) {

                product.stock -=
                    item.quantity;

            }

        }
    );


    /* CREATE SALE */

    let sale = {

        id: Date.now(),

        customer: customer,

        subtotal: subtotal,

        discount: discount,

        total: total,

        payment: payment,

        change: change,

        items: [...cart],

        date:
            new Date().toLocaleString()

    };


    sales.push(sale);


    saveData();


    alert(
        "Sale completed!\n\n" +
        "Total: $" +
        total.toFixed(2) +
        "\nPayment: $" +
        payment.toFixed(2) +
        "\nChange: $" +
        change.toFixed(2)
    );


    cart = [];


    document.getElementById(
        "discount"
    ).value = 0;


    document.getElementById(
        "payment"
    ).value = "";


    document.getElementById(
        "saleCustomer"
    ).value = "";


    displayCart();

    displayPOSProducts();

    updateDashboard();

}


/* =====================================================
   CUSTOMER MANAGEMENT
===================================================== */

document
    .getElementById("customerForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            let id =
                document.getElementById(
                    "customerId"
                ).value;


            let name =
                document.getElementById(
                    "customerName"
                ).value.trim();

            let phone =
                document.getElementById(
                    "customerPhone"
                ).value.trim();

            let email =
                document.getElementById(
                    "customerEmail"
                ).value.trim();


            if (id) {

                let customer =
                    customers.find(
                        c =>
                            c.id ==
                            Number(id)
                    );


                if (customer) {

                    customer.name =
                        name;

                    customer.phone =
                        phone;

                    customer.email =
                        email;

                }

            } else {

                customers.push({

                    id: Date.now(),

                    name: name,

                    phone: phone,

                    email: email

                });

            }


            saveData();


            document
                .getElementById(
                    "customerForm"
                )
                .reset();


            document.getElementById(
                "customerId"
            ).value = "";


            displayCustomers();

            updateDashboard();

        }
    );


/* =====================================================
   DISPLAY CUSTOMERS
===================================================== */

function displayCustomers() {

    let table =
        document.getElementById(
            "customersTable"
        );


    let search =
        document.getElementById(
            "customerSearch"
        ).value.toLowerCase();


    let filtered =
        customers.filter(
            customer =>
                customer.name
                    .toLowerCase()
                    .includes(search)
                ||
                customer.phone
                    .includes(search)
        );


    table.innerHTML = "";


    filtered.forEach(
        customer => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${customer.id}
                    </td>

                    <td>
                        ${customer.name}
                    </td>

                    <td>
                        ${customer.phone}
                    </td>

                    <td>
                        ${customer.email || "-"}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteCustomer(${customer.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   DELETE CUSTOMER
===================================================== */

function deleteCustomer(id) {

    if (
        !confirm(
            "Delete this customer?"
        )
    ) {

        return;
    }


    customers =
        customers.filter(
            customer =>
                customer.id !== id
        );


    saveData();

    displayCustomers();

    updateDashboard();

}


/* =====================================================
   INVENTORY
===================================================== */

function displayInventory() {

    let table =
        document.getElementById(
            "inventoryTable"
        );


    table.innerHTML = "";


    products.forEach(
        product => {

            let status = "";


            if (product.stock === 0) {

                status = `
                    <span class="status status-out">
                        Out of Stock
                    </span>
                `;

            } else if (product.stock <= 5) {

                status = `
                    <span class="status status-low">
                        Low Stock
                    </span>
                `;

            } else {

                status = `
                    <span class="status status-good">
                        Good
                    </span>
                `;

            }


            table.innerHTML += `

                <tr>

                    <td>
                        ${product.id}
                    </td>

                    <td>
                        ${product.name}
                    </td>

                    <td>
                        ${product.category}
                    </td>

                    <td>
                        $${product.price.toFixed(2)}
                    </td>

                    <td>
                        ${product.stock}
                    </td>

                    <td>
                        ${status}
                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    document.getElementById(
        "totalProducts"
    ).innerText =
        products.length;


    document.getElementById(
        "totalSales"
    ).innerText =
        sales.length;


    let revenue =
        sales.reduce(
            (
                total,
                sale
            ) =>
                total +
                sale.total,
            0
        );


    document.getElementById(
        "totalRevenue"
    ).innerText =
        revenue.toFixed(2);


    document.getElementById(
        "totalCustomers"
    ).innerText =
        customers.length;


    let lowStock =
        products.filter(
            product =>
                product.stock <= 5
        ).length;


    document.getElementById(
        "lowStock"
    ).innerText =
        lowStock;


    displayRecentSales();

}


/* =====================================================
   RECENT SALES
===================================================== */

function displayRecentSales() {

    let table =
        document.getElementById(
            "recentSalesTable"
        );


    table.innerHTML = "";


    let recent =
        [...sales]
            .reverse()
            .slice(0, 5);


    recent.forEach(
        sale => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${sale.id}
                    </td>

                    <td>
                        ${sale.customer}
                    </td>

                    <td>
                        $${sale.total.toFixed(2)}
                    </td>

                    <td>
                        ${sale.date}
                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   REPORTS
===================================================== */

function displayReports() {

    let table =
        document.getElementById(
            "reportsTable"
        );


    table.innerHTML = "";


    let revenue = 0;

    let discount = 0;


    sales.forEach(
        sale => {

            revenue +=
                sale.total;

            discount +=
                sale.discount;


            table.innerHTML += `

                <tr>

                    <td>
                        ${sale.id}
                    </td>

                    <td>
                        ${sale.customer}
                    </td>

                    <td>
                        $${sale.subtotal.toFixed(2)}
                    </td>

                    <td>
                        $${sale.discount.toFixed(2)}
                    </td>

                    <td>
                        $${sale.total.toFixed(2)}
                    </td>

                    <td>
                        $${sale.payment.toFixed(2)}
                    </td>

                    <td>
                        $${sale.change.toFixed(2)}
                    </td>

                    <td>
                        ${sale.date}
                    </td>

                </tr>

            `;

        }
    );


    document.getElementById(
        "reportTransactions"
    ).innerText =
        sales.length;


    document.getElementById(
        "reportRevenue"
    ).innerText =
        revenue.toFixed(2);


    document.getElementById(
        "reportDiscount"
    ).innerText =
        discount.toFixed(2);

}