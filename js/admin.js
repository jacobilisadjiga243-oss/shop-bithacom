// ===== AUTHENTIFICATION =====
const PASSWORD = "bitha2025"; // Modifie ce mot de passe si tu veux

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("admin-password").value;
    if (pass === PASSWORD) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("admin-section").style.display = "block";
        loadProducts();
    } else {
        alert("Mot de passe incorrect !");
    }
});

// ===== GESTION DES PRODUITS =====
let products = JSON.parse(localStorage.getItem("bitha_products")) || [];

document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById("p-name").value,
        price: document.getElementById("p-price").value,
        desc: document.getElementById("p-desc").value,
        img: document.getElementById("p-img").value
    };
    products.push(newProduct);
    localStorage.setItem("bitha_products", JSON.stringify(products));
    
    // Réinitialiser le formulaire
    document.getElementById("product-form").reset();
    loadProducts();
});

function loadProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach((p, index) => {
        list.innerHTML += `
            <tr>
                <td><img src="${p.img}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td><button class="btn-danger" onclick="deleteProduct(${index})">Supprimer</button></td>
            </tr>
        `;
    });
}

function deleteProduct(index) {
    if (confirm("Supprimer ce produit ?")) {
        products.splice(index, 1);
        localStorage.setItem("bitha_products", JSON.stringify(products));
        loadProducts();
    }
}

// ===== GÉNÉRATION DU CODE HTML =====
function generateCode() {
    let html = "";
    products.forEach(p => {
        html += `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="desc">${p.desc}</p>
                <p class="price">${p.price}</p>
                <button class="btn-buy">Commander</button>
            </div>
        </div>
        `;
    });
    
    document.getElementById("code-output").style.display = "block";
    document.getElementById("code-text").value = html;
    alert("Code généré en bas de la page !");
}
