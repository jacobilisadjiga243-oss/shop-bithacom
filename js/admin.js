const PASSWORD = "bitha2025";
let products = [];

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("admin-password").value === PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "flex";
        loadProducts();
    } else { alert("Mot de passe incorrect !"); }
});

function logout() { location.reload(); }

async function loadProducts() {
    try {
        const res = await fetch('/api');
        products = await res.json();
        displayProducts();
    } catch (err) {
        alert("Erreur de connexion à la base de données.");
    }
}

document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById("p-name").value,
        price: document.getElementById("p-price").value,
        currency: document.getElementById("p-currency").value,
        desc: document.getElementById("p-desc").value,
        img: document.getElementById("p-img").value
    };

    try {
        const res = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        if(res.ok) {
            document.getElementById("product-form").reset();
            loadProducts();
            alert("✅ Produit ajouté au site !");
        }
    } catch (err) {
        alert("Erreur lors de l'ajout.");
    }
});

function displayProducts() {
    document.getElementById("stat-total").innerText = products.length;
    document.getElementById("stat-date").innerText = new Date().toLocaleDateString('fr-FR');
    
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach((p) => {
        const priceDisplay = p.devise === 'USD' ? `$ ${p.prix}` : `${p.prix} FC`;
        list.innerHTML += `
            <tr>
                <td><img src="${p.image_url}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
                <td><strong>${p.nom}</strong><br><small style="color:#666">${p.description}</small></td>
                <td style="color:#f59e0b; font-weight:bold;">${priceDisplay}</td>
                <td><button class="btn-danger" onclick="deleteProduct(${p.id})">Supprimer</button></td>
            </tr>
        `;
    });
}

async function deleteProduct(id) {
    if (confirm("Supprimer ce produit ?")) {
        try {
            await fetch(`/api?id=${id}`, { method: 'DELETE' });
            loadProducts();
        } catch (err) { alert("Erreur de suppression."); }
    }
}
