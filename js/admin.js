const PASSWORD = "bitha2025";
let products = [];
let avis = [];

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("admin-password").value === PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "flex";
        loadProducts();
        loadAvis();
    } else { alert("Mot de passe incorrect !"); }
});

function logout() { location.reload(); }

function showTab(tab) {
    document.getElementById('section-produits').style.display = tab === 'produits' ? 'block' : 'none';
    document.getElementById('section-avis').style.display = tab === 'avis' ? 'block' : 'none';
    document.getElementById('tab-produits').classList.toggle('active', tab === 'produits');
    document.getElementById('tab-avis').classList.toggle('active', tab === 'avis');
}

// --- PRODUITS ---
async function loadProducts() {
    const res = await fetch('/api');
    products = await res.json();
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach(p => {
        const priceDisplay = p.devise === 'USD' ? `$ ${p.prix}` : `${p.prix} FC`;
        list.innerHTML += `<tr><td><img src="${p.image_url}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;"></td><td>${p.nom}</td><td>${priceDisplay}</td><td>${p.categorie || 'Standard'}</td><td><button class="btn-danger" onclick="deleteProduct(${p.id})">X</button></td></tr>`;
    });
}

document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById("p-name").value,
        price: document.getElementById("p-price").value,
        currency: document.getElementById("p-currency").value,
        desc: document.getElementById("p-desc").value,
        img: document.getElementById("p-img").value,
        category: document.getElementById("p-category").value
    };
    await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProduct) });
    document.getElementById("product-form").reset();
    loadProducts();
});

async function deleteProduct(id) {
    if (confirm("Supprimer ?")) { await fetch(`/api?id=${id}`, { method: 'DELETE' }); loadProducts(); }
}

// --- AVIS ---
async function loadAvis() {
    const res = await fetch('/api/avis');
    avis = await res.json();
    const list = document.getElementById("avis-list");
    list.innerHTML = "";
    avis.forEach(a => {
        list.innerHTML += `<tr><td>${a.nom_client}</td><td>${'⭐'.repeat(a.note)}</td><td>${a.commentaire}</td><td><button class="btn-danger" onclick="deleteAvis(${a.id})">X</button></td></tr>`;
    });
}

document.getElementById("avis-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newAvis = {
        nom: document.getElementById("a-name").value,
        note: document.getElementById("a-note").value,
        commentaire: document.getElementById("a-comment").value
    };
    await fetch('/api/avis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAvis) });
    document.getElementById("avis-form").reset();
    loadAvis();
});

async function deleteAvis(id) {
    if (confirm("Supprimer ?")) { await fetch(`/api/avis?id=${id}`, { method: 'DELETE' }); loadAvis(); }
}
