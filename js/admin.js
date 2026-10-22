const PASSWORD = "bitha2025";

// Gestion de la connexion
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("admin-password").value;
    if (pass === PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "flex";
        loadProducts();
    } else {
        alert("Mot de passe incorrect !");
    }
});

function logout() {
    location.reload();
}

// Gestion des produits
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
    document.getElementById("product-form").reset();
    loadProducts();
});

function loadProducts() {
    document.getElementById("stat-total").innerText = products.length;
    document.getElementById("stat-date").innerText = new Date().toLocaleDateString('fr-FR');
    
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach((p, index) => {
        list.innerHTML += `
            <tr>
                <td><img src="${p.img}" alt="${p.name}"></td>
                <td><strong>${p.name}</strong><br><small style="color:#666">${p.desc}</small></td>
                <td style="color:#f59e0b; font-weight:bold;">${p.price}</td>
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

// Téléchargement du fichier JSON (Sans toucher au code HTML)
function exportData() {
    if (products.length === 0) {
        alert("Aucun produit à sauvegarder !");
        return;
    }
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();
    URL.revokeObjectURL(url);
}
