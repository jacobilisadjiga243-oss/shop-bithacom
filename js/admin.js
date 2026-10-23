const PASSWORD = "bitha2025";
let products = [];

// Connexion
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("admin-password").value === PASSWORD) {
        localStorage.setItem("bitha_admin", "true");
        afficherDashboard();
    } else { alert("Mot de passe incorrect !"); }
});

// Vérifier si déjà connecté
document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("bitha_admin") === "true") {
        afficherDashboard();
    }
});

function afficherDashboard() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "flex";
    loadStats(); loadProducts(); loadColis(); loadAdresses(); loadAvis();
}

function logout() { localStorage.removeItem("bitha_admin"); location.reload(); }

// Navigation
function showTab(tab) {
    // On cache toutes les sections
    const sections = ['produits', 'colis', 'adresses', 'avis'];
    sections.forEach(s => {
        const el = document.getElementById('section-' + s);
        if(el) el.style.display = 'none';
    });

    // On affiche la bonne section
    const activeSection = document.getElementById('section-' + tab);
    if(activeSection) activeSection.style.display = 'block';

    // On gère la couleur active du menu
    sections.forEach(s => {
        const btn = document.getElementById('tab-' + s);
        if(btn) btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('tab-' + tab);
    if(activeBtn) activeBtn.classList.add('active');

    // On charge les données de la section
    if(tab === 'colis') loadColis();
    if(tab === 'adresses') loadAdresses();
    if(tab === 'avis') loadAvis();
    if(tab === 'produits') loadProducts();
}

// Stats
async function loadStats() {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        document.getElementById('stat-total').innerText = stats.produits;
        document.getElementById('stat-avis-attente').innerText = stats.avisAttente;
    } catch(e) {}
}

// PRODUITS
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

document.getElementById("p-img").addEventListener("input", function() {
    const img = document.getElementById("preview-img");
    img.src = this.value;
    img.style.display = this.value ? "block" : "none";
});

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
    cancelEdit(); loadProducts(); loadStats();
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
    document.getElementById("preview-img").src = p.image_url;
    document.getElementById("preview-img").style.display = "block";
    document.getElementById("form-title").innerText = "✏️ Modifier";
    document.getElementById("btn-submit").innerText = "Mettre à jour";
    document.getElementById("btn-cancel").style.display = "block";
    window.scrollTo(0, 0);
}

function cancelEdit() {
    document.getElementById("product-form").reset();
    document.getElementById("p-id").value = "";
    document.getElementById("preview-img").style.display = "none";
    document.getElementById("form-title").innerText = "➕ Ajouter un produit";
    document.getElementById("btn-submit").innerText = "💾 Enregistrer";
    document.getElementById("btn-cancel").style.display = "none";
}

async function deleteProduct(id) {
    if (confirm("Supprimer ce produit ?")) { await fetch(`/api?id=${id}`, { method: 'DELETE' }); loadProducts(); loadStats(); }
}

// COLIS
async function loadColis() {
    const res = await fetch('/api/voyages');
    const voyages = await res.json();
    const list = document.getElementById("colis-list");
    list.innerHTML = "";
    voyages.forEach(v => {
        const priceDisplay = v.devise === 'USD' ? `$ ${v.prix}/kg` : `${v.prix} FC/kg`;
        const icon = v.type_voyage === 'aerien' ? '✈️' : v.type_voyage === 'maritime' ? '🚢' : '🚌';
        list.innerHTML += `<tr><td>${icon} ${v.type_voyage}</td><td>${v.destination}</td><td>${v.date_depart}</td><td>${priceDisplay}</td><td><button class="btn-danger" onclick="deleteColis(${v.id})">X</button></td></tr>`;
    });
}

document.getElementById("colis-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newColis = {
        type: document.getElementById("c-type").value,
        destination: document.getElementById("c-dest").value,
        date: document.getElementById("c-date").value,
        price: document.getElementById("c-price").value,
        currency: document.getElementById("c-currency").value,
        desc: document.getElementById("c-desc").value,
        img: document.getElementById("c-img").value
    };
    await fetch('/api/voyages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newColis) });
    document.getElementById("colis-form").reset();
    loadColis();
    alert("✅ Programme ajouté !");
});

async function deleteColis(id) {
    if (confirm("Supprimer ?")) { await fetch(`/api/voyages?id=${id}`, { method: 'DELETE' }); loadColis(); }
}

// AVIS
async function loadAvis() {
    const res = await fetch('/api/avis');
    const avis = await res.json();
    const list = document.getElementById("avis-list");
    list.innerHTML = "";
    avis.forEach(a => {
        const statut = a.approuve ? "<span style='color:green;'>✅ Publié</span>" : "<span style='color:orange;'>⏳ En attente</span>";
        const btn = a.approuve ? "" : `<button onclick="approveAvis(${a.id})" style="background:#10b981; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; margin-right:5px;">Publier</button>`;
        list.innerHTML += `<tr><td>${a.nom_client}</td><td>${'⭐'.repeat(a.note)}</td><td>${a.commentaire}</td><td>${statut}</td><td>${btn}<button class="btn-danger" onclick="deleteAvis(${a.id})">X</button></td></tr>`;
    });
}

async function approveAvis(id) {
    await fetch('/api/avis', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) });
    loadAvis(); loadStats();
}

async function deleteAvis(id) {
    if (confirm("Supprimer ?")) { await fetch(`/api/avis?id=${id}`, { method: 'DELETE' }); loadAvis(); loadStats(); }
}



