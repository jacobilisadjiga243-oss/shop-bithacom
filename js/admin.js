const PASSWORD = "bitha2025";
// Aperçu de l'image
document.getElementById("p-img").addEventListener("input", function() {
    const img = document.getElementById("preview-img");
    if(this.value.trim() !== "") {
        img.src = this.value;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
});
let products = [];

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("admin-password").value === PASSWORD) {
        localStorage.setItem("bitha_admin_logged", "true");
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "flex";
        loadStats();
        loadProducts();
        loadAvis();
    } else { alert("Mot de passe incorrect !"); }
});

function logout() { localStorage.removeItem("bitha_admin_logged"); location.reload(); }
// Vérifier si déjà connecté au chargement
document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("bitha_admin_logged") === "true") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "flex";
        loadStats(); loadProducts(); loadAvis();
    }
});

function showTab(tab) {
    document.getElementById('section-produits').style.display = tab === 'produits' ? 'block' : 'none';
    document.getElementById('section-avis').style.display = tab === 'avis' ? 'block' : 'none';
    document.getElementById('tab-produits').classList.toggle('active', tab === 'produits');
    document.getElementById('tab-avis').classList.toggle('active', tab === 'avis');
    if(tab === 'avis') loadAvis();
    if(tab === 'voyages') loadVoyages();
    if(tab === 'voyages') loadVoyages();
    if(tab === 'produits') loadProducts();
}

// --- STATISTIQUES ---
async function loadStats() {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        document.getElementById('stat-total').innerText = stats.produits;
        document.getElementById('stat-avis-attente').innerText = stats.avisAttente;
        document.getElementById('stat-avis-total').innerText = stats.avisTotal;
    } catch(e) { console.log("Erreur stats"); }
}

// --- PRODUITS ---
async function loadProducts() {
    const res = await fetch('/api');
    products = await res.json();
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach(p => {
        const priceDisplay = p.devise === 'USD' ? `$ ${p.prix}` : `${p.prix} FC`;
        list.innerHTML += `<tr>
            <td><img src="${p.image_url}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;"></td>
            <td>${p.nom}</td><td>${priceDisplay}</td><td>${p.categorie}</td>
            <td>
                <button onclick="editProduct(${p.id})" style="background:#3b82f6; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; margin-right:5px;">Modifier</button>
                <button class="btn-danger" onclick="deleteProduct(${p.id})">X</button>
            </td>
        </tr>`;
    });
}

document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("p-id").value;
    const newProduct = {
        name: document.getElementById("p-name").value,
        price: document.getElementById("p-price").value,
        currency: document.getElementById("p-currency").value,
        desc: document.getElementById("p-desc").value,
        img: document.getElementById("p-img").value,
        category: document.getElementById("p-category").value
    };

    const method = id ? 'PUT' : 'POST';
    if(id) newProduct.id = id;

    await fetch('/api', { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProduct) });
    cancelEdit();
    loadProducts();
    loadStats();
});

function editProduct(id) {
    const p = products.find(prod => prod.id === id);
    if(!p) return;
    document.getElementById("p-id").value = p.id;
    document.getElementById("p-name").value = p.nom;
    document.getElementById("p-price").value = p.prix;
    document.getElementById("p-currency").value = p.devise;
    document.getElementById("p-desc").value = p.description;
    document.getElementById("p-img").value = p.image_url;
    document.getElementById("p-category").value = p.categorie;
    
    document.getElementById("form-title").innerText = "✏️ Modifier le produit";
    document.getElementById("btn-submit").innerText = "Mettre à jour";
    document.getElementById("btn-cancel").style.display = "block";
    window.scrollTo(0, 0);
}

function cancelEdit() {
    document.getElementById("product-form").reset();
    document.getElementById("p-id").value = "";
    document.getElementById("form-title").innerText = "➕ Ajouter un produit";
    document.getElementById("btn-submit").innerText = "💾 Enregistrer";
    document.getElementById("btn-cancel").style.display = "none";
}

async function deleteProduct(id) {
    if (confirm("Supprimer ce produit ?")) { await fetch(`/api?id=${id}`, { method: 'DELETE' }); loadProducts(); loadStats(); }
}

// --- VOYAGES ---
async function loadVoyages() {
    const res = await fetch('/api/voyages');
    const voyages = await res.json();
    const list = document.getElementById("voyage-list");
    list.innerHTML = "";
    voyages.forEach(v => {
        const priceDisplay = v.devise === 'USD' ? `$ ${v.prix}` : `${v.prix} FC`;
        const icon = v.type_voyage === 'vol' ? '✈️' : v.type_voyage === 'maritime' ? '🚢' : '🚌';
        list.innerHTML += `<tr><td>${icon} ${v.type_voyage}</td><td>${v.destination}</td><td>${v.date_depart}</td><td>${priceDisplay}</td><td><button class="btn-danger" onclick="deleteVoyage(${v.id})">X</button></td></tr>`;
    });
}

document.getElementById("voyage-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newVoyage = {
        type: document.getElementById("v-type").value,
        destination: document.getElementById("v-destination").value,
        date: document.getElementById("v-date").value,
        price: document.getElementById("v-price").value,
        currency: document.getElementById("v-currency").value,
        desc: document.getElementById("v-desc").value,
        img: document.getElementById("v-img").value
    };
    await fetch('/api/voyages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newVoyage) });
    document.getElementById("voyage-form").reset();
    loadVoyages();
});

async function deleteVoyage(id) {
    if (confirm("Supprimer ce voyage ?")) { await fetch(`/api/voyages?id=${id}`, { method: 'DELETE' }); loadVoyages(); }
}
// --- AGENCE DE COLIS ---
async function loadVoyages() {
    const res = await fetch('/api/voyages');
    const voyages = await res.json();
    const list = document.getElementById("voyage-list");
    list.innerHTML = "";
    voyages.forEach(v => {
        const priceDisplay = v.devise === 'USD' ? `$ ${v.prix}` : `${v.prix} FC`;
        const icon = v.type_voyage === 'aerien' ? '✈️' : v.type_voyage === 'maritime' ? '🚢' : '🚌';
        list.innerHTML += `<tr><td>${icon} ${v.type_voyage}</td><td>${v.destination}</td><td>${v.date_depart}</td><td>${priceDisplay}</td><td><button class="btn-danger" onclick="deleteVoyage(${v.id})">X</button></td></tr>`;
    });
}

document.getElementById("voyage-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newVoyage = {
        type: document.getElementById("v-type").value,
        destination: document.getElementById("v-destination").value,
        date: document.getElementById("v-date").value,
        price: document.getElementById("v-price").value,
        currency: document.getElementById("v-currency").value,
        desc: document.getElementById("v-desc").value,
        img: document.getElementById("v-img").value
    };
    await fetch('/api/voyages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newVoyage) });
    document.getElementById("voyage-form").reset();
    loadVoyages();
});

async function deleteVoyage(id) {
    if (confirm("Supprimer cet envoi ?")) { await fetch(`/api/voyages?id=${id}`, { method: 'DELETE' }); loadVoyages(); }
}
// --- AVIS ---
async function loadAvis() {
    const res = await fetch('/api/avis');
    const avis = await res.json();
    const list = document.getElementById("avis-list");
    list.innerHTML = "";
    if(avis.length === 0) { list.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Aucun avis pour le moment.</td></tr>"; return; }
    
    avis.forEach(a => {
        const statut = a.approuve ? "<span style='color:green;font-weight:bold;'>✅ Publié</span>" : "<span style='color:orange;font-weight:bold;'>⏳ En attente</span>";
        const btnPublier = a.approuve ? "" : `<button onclick="approveAvis(${a.id})" style="background:#10b981; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; margin-right:5px;">Publier</button>`;
        
        list.innerHTML += `<tr>
            <td>${a.nom_client}</td>
            <td>${'⭐'.repeat(a.note)}</td>
            <td>${a.commentaire}</td>
            <td>${statut}</td>
            <td>${btnPublier}<button class="btn-danger" onclick="deleteAvis(${a.id})">X</button></td>
        </tr>`;
    });
}

async function approveAvis(id) {
    await fetch('/api/avis', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) });
    loadAvis();
    loadStats();
}

async function deleteAvis(id) {
    if (confirm("Supprimer cet avis ?")) { await fetch(`/api/avis?id=${id}`, { method: 'DELETE' }); loadAvis(); loadStats(); }
}




