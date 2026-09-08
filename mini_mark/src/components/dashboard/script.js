/* =====================================================
   DATA
===================================================== */

let users = JSON.parse(
    localStorage.getItem("users") || "[]"
);

let products = JSON.parse(
    localStorage.getItem("products") || "[]"
);

let sales = JSON.parse(
    localStorage.getItem("sales") || "[]"
);

let cart = [];

let currentUser = null;


/* =====================================================
   SAVE DATA
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
        "sales",
        JSON.stringify(sales)
    );
}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("loginForm")
        .addEventListener("submit", login);

    document.getElementById("registerForm")
        .addEventListener("submit", register);

    document.getElementById("productForm")
        .addEventListener("submit", saveProduct);

    document.getElementById("productSearch")
        .addEventListener("input", displayProducts);

    document.getElementById("posSearch")
        .addEventListener("input", displayPOSProducts);

    document.getElementById("inventorySearch")
        .addEventListener("input", displayInventory);

    document.getElementById("discount")
        .addEventListener("input", updateCartTotal);

    document.getElementById("payment")
        .addEventListener("input", updateCartTotal);

    document.getElementById("currentDate").innerText =
        new Date().toLocaleDateString();

    /*
       Check saved login
    */

    let savedUser = JSON.parse(
        localStorage.getItem("currentUser") || "null"
    );

    if (savedUser) {

        currentUser = savedUser;

        showSystem();

    }

});


/* =====================================================
   LOGIN / REGISTER PAGE
===================================================== */

function showRegister() {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("registerPage")
        .classList.remove("hidden");
}


function showLogin() {

    document
        .getElementById("registerPage")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");
}


/* =====================================================
   REGISTER
===================================================== */

function register(event) {

    event.preventDefault();

    let firstName =
        document.getElementById("firstName").value.trim();

    let lastName =
        document.getElementById("lastName").value.trim();

    let gender =
        document.getElementById("gender").value;

    let email =
        document.getElementById("registerEmail").value
        .trim()
        .toLowerCase();

    let password =
        document.getElementById("registerPassword").value;

    let role =
        document.getElementById("role").value;


    /*
       Check existing email
    */

    let existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {

        alert("Email already exists!");

        return;
    }


    /*
       Create user
    */

    let newUser = {

        id: Date.now(),

        first_name: firstName,

        last_name: lastName,

        gender: gender,

        email: email,

        password: password,

        role: role

    };


    users.push(newUser);

    saveData();


    alert("Registration successful!");


    document
        .getElementById("registerForm")
        .reset();

    showLogin();

}


/* =====================================================
   LOGIN
===================================================== */

function login(event) {

    event.preventDefault();

    let email =
        document.getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

    let password =
        document.getElementById("loginPassword")
            .value;


    let user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );


    if (!user) {

        alert("Invalid email or password!");

        return;
    }


    currentUser = user;


    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    showSystem();

}


/* =====================================================
   SHOW SYSTEM
===================================================== */

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


    document.getElementById("currentUserName")
        .innerText =
        currentUser.first_name +
        " " +
        currentUser.last_name;


    document.getElementById("currentUserRole")
        .innerText =
        currentUser.role;


    displayDashboard();

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    if (!confirm("Are you sure you want to logout?")) {

        return;
    }


    currentUser = null;

    localStorage.removeItem("currentUser");

    cart = [];


    document
        .getElementById("systemPage")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("loginForm")
        .reset();

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(page) {

    let pages =
        document.querySelectorAll(".content-page");


    pages.forEach(function (section) {

        section.classList.add("hidden");

    });


    let selectedPage =
        document.getElementById(page + "Page");


    if (selectedPage) {

        selectedPage.classList.remove("hidden");

    }


    let titles = {

        dashboard: "Dashboard",

        products: "Product Management",

        pos: "POS / Sales",

        inventory: "Inventory",

        reports: "Sales Reports"

    };


    document.getElementById("pageTitle")
        .innerText =
        titles[page] || "Dashboard";


    /*
       Active sidebar
    */

    document
        .querySelectorAll(".nav-btn")
        .forEach(function (button) {

            button.classList.remove("active");

        });


    let buttons =
        document.querySelectorAll(".nav-btn");


    let index = {

        dashboard: 0,

        products: 1,

        pos: 2,

        inventory: 3,

        reports: 4

    };


    if (buttons[index[page]]) {

        buttons[index[page]]
            .classList.add("active");

    }


    /*
       Refresh page data
    */

    if (page === "dashboard") {

        displayDashboard();

    }

    if (page === "products") {

        displayProducts();

    }

    if (page === "pos") {

        displayPOSProducts();

        displayCart();

    }

    if (page === "inventory") {

        displayInventory();

    }

    if (page === "reports") {

        displayReports();

    }

}


/* =====================================================
   DASHBOARD
===================================================== */

function displayDashboard() {

    document.getElementById(
        "dashboardProducts"
    ).innerText = products.length;


    let revenue = sales.reduce(
        (sum, sale) =>
            sum + Number(sale.total || 0),
        0
    );


    document.getElementById(
        "dashboardRevenue"
    ).innerText =
        revenue.toFixed(2);


    document.getElementById(
        "dashboardSales"
    ).innerText =
        sales.length;


    let lowStock =
        products.filter(
            product =>
                Number(product.stock) <= 5
        );


    document.getElementById(
        "dashboardLowStock"
    ).innerText =
        lowStock.length;


    displayRecentSales();

    displayLowStock();

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


    let recentSales =
        sales.slice(-5).reverse();


    if (recentSales.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-cart">
                    No sales yet
                </td>
            </tr>
        `;

        return;
    }


    recentSales.forEach(function (sale) {

        table.innerHTML += `

            <tr>

                <td>${sale.id}</td>

                <td>
                    ${escapeHTML(
                        sale.customer ||
                        "Walk-in Customer"
                    )}
                </td>

                <td>
                    $${Number(
                        sale.total || 0
                    ).toFixed(2)}
                </td>

                <td>
                    ${sale.date}
                </td>

            </tr>

        `;

    });

}


/* =====================================================
   LOW STOCK
===================================================== */

function displayLowStock() {

    let container =
        document.getElementById(
            "lowStockList"
        );


    container.innerHTML = "";


    let lowProducts =
        products.filter(
            product =>
                Number(product.stock) <= 5
        );


    if (lowProducts.length === 0) {

        container.innerHTML = `
            <p style="
                color:#278347;
                padding:20px 0;
            ">
                ✓ All products have enough stock.
            </p>
        `;

        return;
    }


    lowProducts.forEach(function (product) {

        container.innerHTML += `

            <div class="low-stock-item">

                <strong>
                    ${escapeHTML(product.name)}
                </strong>

                <small>
                    ${product.stock} left
                </small>

            </div>

        `;

    });

}


/* =====================================================
   PRODUCT MANAGEMENT
===================================================== */

function saveProduct(event) {

    event.preventDefault();


    let id =
        document.getElementById("productId")
            .value;


    let name =
        document.getElementById("productName")
            .value.trim();


    let price =
        Number(
            document.getElementById("productPrice")
                .value
        );


    let stock =
        Number(
            document.getElementById("productStock")
                .value
        );


    let category =
        document.getElementById("productCategory")
            .value;


    if (!name) {

        alert("Please enter product name.");

        return;
    }


    if (price < 0 || stock < 0) {

        alert("Price and stock cannot be negative.");

        return;
    }


    /*
       UPDATE
    */

    if (id) {

        let product =
            products.find(
                p => String(p.id) === String(id)
            );


        if (product) {

            product.name = name;

            product.price = price;

            product.stock = stock;

            product.category = category;

        }


        alert("Product updated successfully!");

    }

    /*
       ADD
    */

    else {

        let newProduct = {

            id: Date.now(),

            name: name,

            price: price,

            stock: stock,

            category: category

        };


        products.push(newProduct);


        alert("Product added successfully!");

    }


    saveData();

    resetProductForm();

    displayProducts();

    displayDashboard();

}


/* =====================================================
   RESET PRODUCT FORM
===================================================== */

function resetProductForm() {

    document
        .getElementById("productForm")
        .reset();


    document
        .getElementById("productId")
        .value = "";


    document
        .getElementById("productSubmitBtn")
        .innerText =
        "Add Product";

}


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
        ).value
        .toLowerCase();


    table.innerHTML = "";


    let filtered =
        products.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(search)
        );


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center;padding:30px">
                    No products found
                </td>
            </tr>
        `;

        return;
    }


    filtered.forEach(function (product) {

        let stock =
            Number(product.stock);


        let status = "";


        if (stock === 0) {

            status = `
                <span class="badge badge-out">
                    Out of Stock
                </span>
            `;

        }
        else if (stock <= 5) {

            status = `
                <span class="badge badge-low">
                    Low Stock
                </span>
            `;

        }
        else {

            status = `
                <span class="badge badge-good">
                    In Stock
                </span>
            `;

        }


        table.innerHTML += `

            <tr>

                <td>${product.id}</td>

                <td>
                    ${escapeHTML(product.name)}
                </td>

                <td>
                    ${escapeHTML(
                        product.category || "Other"
                    )}
                </td>

                <td>
                    $${Number(
                        product.price
                    ).toFixed(2)}
                </td>

                <td>${stock}</td>

                <td>${status}</td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        onclick="editProduct(${product.id})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteProduct(${product.id})"
                    >
                        🗑️ Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(id) {

    let product =
        products.find(
            p => p.id === id
        );


    if (!product) {

        return;
    }


    document.getElementById(
        "productId"
    ).value = product.id;


    document.getElementById(
        "productName"
    ).value = product.name;


    document.getElementById(
        "productPrice"
    ).value = product.price;


    document.getElementById(
        "productStock"
    ).value = product.stock;


    document.getElementById(
        "productCategory"
    ).value =
        product.category || "Other";


    document.getElementById(
        "productSubmitBtn"
    ).innerText =
        "Update Product";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(id) {

    let product =
        products.find(
            p => p.id === id
        );


    if (!product) {

        return;
    }


    if (
        !confirm(
            `Delete ${product.name}?`
        )
    ) {

        return;
    }


    products =
        products.filter(
            p => p.id !== id
        );


    saveData();

    displayProducts();

    displayPOSProducts();

    displayInventory();

    displayDashboard();

}


/* =====================================================
   POS PRODUCTS
===================================================== */

function displayPOSProducts() {

    let container =
        document.getElementById(
            "posProducts"
        );


    let search =
        document.getElementById(
            "posSearch"
        ).value
        .toLowerCase();


    container.innerHTML = "";


    let filtered =
        products.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(search)
        );


    if (filtered.length === 0) {

        container.innerHTML = `
            <p style="color:#999">
                No products found.
            </p>
        `;

        return;
    }


    filtered.forEach(function (product) {

        let stock =
            Number(product.stock);


        container.innerHTML += `

            <div class="pos-product">

                <span class="category">
                    ${escapeHTML(
                        product.category || "Other"
                    )}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="price">
                    $${Number(
                        product.price
                    ).toFixed(2)}
                </div>

                <div class="stock">
                    Stock: ${stock}
                </div>

                <button
                    class="add-cart-btn"
                    onclick="addToCart(${product.id})"
                    ${stock <= 0 ? "disabled" : ""}
                >
                    ${
                        stock <= 0
                        ? "Out of Stock"
                        : "+ Add to Cart"
                    }
                </button>

            </div>

        `;

    });

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    let product =
        products.find(
            p => p.id === id
        );


    if (!product) {

        return;
    }


    if (Number(product.stock) <= 0) {

        alert("Product is out of stock.");

        return;
    }


    let existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        if (
            existing.qty >=
            Number(product.stock)
        ) {

            alert(
                "You cannot add more than available stock."
            );

            return;
        }


        existing.qty++;

    }

    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            qty: 1

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


    document.getElementById(
        "cartCount"
    ).innerText =
        cart.reduce(
            (sum, item) =>
                sum + item.qty,
            0
        );


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                🛒 Your cart is empty
            </div>
        `;

        updateCartTotal();

        return;
    }


    cart.forEach(function (item) {

        container.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <small>
                        $${Number(
                            item.price
                        ).toFixed(2)}
                    </small>

                </div>


                <div class="qty-controls">

                    <button
                        class="qty-btn"
                        onclick="changeQty(
                            ${item.id},
                            -1
                        )"
                    >
                        −
                    </button>

                    <span>
                        ${item.qty}
                    </span>

                    <button
                        class="qty-btn"
                        onclick="changeQty(
                            ${item.id},
                            1
                        )"
                    >
                        +
                    </button>

                </div>


                <strong>
                    $${(
                        item.price *
                        item.qty
                    ).toFixed(2)}
                </strong>


                <button
                    class="remove-cart-btn"
                    onclick="removeFromCart(${item.id})"
                >
                    ×
                </button>

            </div>

        `;

    });


    updateCartTotal();

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQty(id, amount) {

    let item =
        cart.find(
            item => item.id === id
        );


    let product =
        products.find(
            product => product.id === id
        );


    if (!item || !product) {

        return;
    }


    let newQty =
        item.qty + amount;


    if (newQty <= 0) {

        removeFromCart(id);

        return;
    }


    if (
        newQty >
        Number(product.stock)
    ) {

        alert(
            "Not enough stock available."
        );

        return;
    }


    item.qty = newQty;


    displayCart();

}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    displayCart();

}


/* =====================================================
   CLEAR CART
===================================================== */

function clearCart() {

    if (cart.length === 0) {

        return;
    }


    if (
        !confirm(
            "Clear all items from cart?"
        )
    ) {

        return;
    }


    cart = [];

    displayCart();

}


/* =====================================================
   UPDATE CART TOTAL
===================================================== */

function updateCartTotal() {

    let subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(item.price) *
                Number(item.qty),
            0
        );


    let discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    if (discount < 0) {

        discount = 0;

    }


    if (discount > subtotal) {

        discount = subtotal;

        document.getElementById(
            "discount"
        ).value =
            discount;

    }


    let total =
        subtotal - discount;


    let payment =
        Number(
            document.getElementById(
                "payment"
            ).value
        ) || 0;


    let change =
        payment - total;


    if (change < 0) {

        change = 0;

    }


    document.getElementById(
        "cartSubtotal"
    ).innerText =
        subtotal.toFixed(2);


    document.getElementById(
        "cartTotal"
    ).innerText =
        total.toFixed(2);


    document.getElementById(
        "change"
    ).innerText =
        change.toFixed(2);


    return {

        subtotal,

        discount,

        total,

        payment,

        change

    };

}


/* =====================================================
   COMPLETE SALE
===================================================== */

function completeSale() {

    if (cart.length === 0) {

        alert("Cart is empty!");

        return;
    }


    let totals =
        updateCartTotal();


    if (
        totals.payment <
        totals.total
    ) {

        alert(
            "Payment is not enough!"
        );

        return;
    }


    /*
       Update stock
    */

    for (let item of cart) {

        let product =
            products.find(
                p => p.id === item.id
            );


        if (!product) {

            alert(
                `Product ${item.name} no longer exists.`
            );

            return;
        }


        if (
            Number(product.stock) <
            Number(item.qty)
        ) {

            alert(
                `Not enough stock for ${item.name}.`
            );

            return;
        }

    }


    /*
       Reduce stock
    */

    cart.forEach(function (item) {

        let product =
            products.find(
                p => p.id === item.id
            );


        product.stock =
            Number(product.stock) -
            Number(item.qty);

    });


    /*
       Customer
    */

    let customer =
        document.getElementById(
            "customerName"
        ).value.trim();


    if (!customer) {

        customer = "Walk-in Customer";

    }


    /*
       Create sale
    */

    let sale = {

        id: Date.now(),

        customer: customer,

        subtotal: totals.subtotal,

        discount: totals.discount,

        total: totals.total,

        payment: totals.payment,

        change: totals.change,

        items: cart.map(
            item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                qty: Number(item.qty)
            })
        ),

        date: new Date().toLocaleString()

    };


    sales.push(sale);


    /*
       Save everything
    */

    saveData();


    /*
       Clear cart
    */

    cart = [];


    document.getElementById(
        "customerName"
    ).value = "";


    document.getElementById(
        "discount"
    ).value = 0;


    document.getElementById(
        "payment"
    ).value = "";


    displayCart();

    displayPOSProducts();

    displayDashboard();

    displayInventory();


    /*
       Success
    */

    alert(
        "Sale completed successfully!"
    );


    /*
       Automatically print invoice
    */

    printInvoice(sale);

}


/* =====================================================
   PRINT INVOICE
===================================================== */

function printInvoice(sale = null) {

    /*
       If no sale was passed,
       use latest sale.
    */

    if (!sale) {

        if (sales.length === 0) {

            alert(
                "No invoice available."
            );

            return;
        }


        sale =
            sales[sales.length - 1];

    }


    /*
       Invoice information
    */

    document.getElementById(
        "invoiceId"
    ).innerText =
        sale.id;


    document.getElementById(
        "invoiceDate"
    ).innerText =
        sale.date;


    document.getElementById(
        "invoiceCustomer"
    ).innerText =
        sale.customer ||
        "Walk-in Customer";


    /*
       Invoice items
    */

    let invoiceItems =
        document.getElementById(
            "invoiceItems"
        );


    invoiceItems.innerHTML = "";


    sale.items.forEach(function (item) {

        let qty =
            Number(item.qty) || 0;


        let price =
            Number(item.price) || 0;


        let total =
            qty * price;


        invoiceItems.innerHTML += `

            <tr>

                <td>
                    ${escapeHTML(item.name)}
                </td>

                <td>
                    ${qty}
                </td>

                <td>
                    $${price.toFixed(2)}
                </td>

                <td>
                    $${total.toFixed(2)}
                </td>

            </tr>

        `;

    });


    /*
       Totals
    */

    document.getElementById(
        "invoiceSubtotal"
    ).innerText =
        Number(
            sale.subtotal || 0
        ).toFixed(2);


    document.getElementById(
        "invoiceDiscount"
    ).innerText =
        Number(
            sale.discount || 0
        ).toFixed(2);


    document.getElementById(
        "invoiceTotal"
    ).innerText =
        Number(
            sale.total || 0
        ).toFixed(2);


    document.getElementById(
        "invoicePayment"
    ).innerText =
        Number(
            sale.payment || 0
        ).toFixed(2);


    document.getElementById(
        "invoiceChange"
    ).innerText =
        Number(
            sale.change || 0
        ).toFixed(2);


    /*
       Print
    */

    window.print();

}


/* =====================================================
   PRINT REPORT
===================================================== */

function printReport() {

    displayReports();

    window.print();

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

    let payment = 0;


    sales.forEach(function (sale) {

        revenue +=
            Number(
                sale.total || 0
            );


        discount +=
            Number(
                sale.discount || 0
            );


        payment +=
            Number(
                sale.payment || 0
            );


        table.innerHTML += `

            <tr>

                <td>
                    ${sale.id}
                </td>

                <td>
                    ${escapeHTML(
                        sale.customer ||
                        "Walk-in Customer"
                    )}
                </td>

                <td>
                    $${Number(
                        sale.subtotal || 0
                    ).toFixed(2)}
                </td>

                <td>
                    $${Number(
                        sale.discount || 0
                    ).toFixed(2)}
                </td>

                <td>
                    $${Number(
                        sale.total || 0
                    ).toFixed(2)}
                </td>

                <td>
                    $${Number(
                        sale.payment || 0
                    ).toFixed(2)}
                </td>

                <td>
                    $${Number(
                        sale.change || 0
                    ).toFixed(2)}
                </td>

                <td>
                    ${sale.date}
                </td>

            </tr>

        `;

    });


    if (sales.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#999;
                    "
                >
                    No sales records found.
                </td>

            </tr>

        `;

    }


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


    document.getElementById(
        "reportPayment"
    ).innerText =
        payment.toFixed(2);


    document.getElementById(
        "reportGeneratedDate"
    ).innerText =
        new Date().toLocaleString();

}


/* =====================================================
   INVENTORY
===================================================== */

function displayInventory() {

    let table =
        document.getElementById(
            "inventoryTable"
        );


    let search =
        document.getElementById(
            "inventorySearch"
        ).value
        .toLowerCase();


    table.innerHTML = "";


    let filtered =
        products.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(search)
        );


    if (filtered.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No products found.
                </td>

            </tr>

        `;

        return;
    }


    filtered.forEach(function (product) {

        let stock =
            Number(product.stock);


        let status;


        if (stock === 0) {

            status = `
                <span class="badge badge-out">
                    Out of Stock
                </span>
            `;

        }
        else if (stock <= 5) {

            status = `
                <span class="badge badge-low">
                    Low Stock
                </span>
            `;

        }
        else {

            status = `
                <span class="badge badge-good">
                    In Stock
                </span>
            `;

        }


        table.innerHTML += `

            <tr>

                <td>
                    ${product.id}
                </td>

                <td>
                    ${escapeHTML(product.name)}
                </td>

                <td>
                    ${escapeHTML(
                        product.category ||
                        "Other"
                    )}
                </td>

                <td>
                    $${Number(
                        product.price
                    ).toFixed(2)}
                </td>

                <td>
                    ${stock}
                </td>

                <td>
                    ${status}
                </td>

            </tr>

        `;

    });

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   DEMO DATA
===================================================== */

/*
   Add sample products automatically
   if there are no products.
*/

if (products.length === 0) {

    products = [

        {
            id: 1001,
            name: "Coca Cola",
            price: 1.50,
            stock: 30,
            category: "Drink"
        },

        {
            id: 1002,
            name: "Pepsi",
            price: 1.40,
            stock: 25,
            category: "Drink"
        },

        {
            id: 1003,
            name: "Potato Chips",
            price: 1.25,
            stock: 20,
            category: "Snack"
        },

        {
            id: 1004,
            name: "Instant Noodles",
            price: 0.80,
            stock: 50,
            category: "Food"
        },

        {
            id: 1005,
            name: "Mineral Water",
            price: 0.75,
            stock: 40,
            category: "Drink"
        },

        {
            id: 1006,
            name: "Soap",
            price: 1.80,
            stock: 15,
            category: "Household"
        }

    ];


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}