// === SCRIPT ADMIN DEFINITIF ===
const PASSWORD = "bitha2025";

// 1. Connexion
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("admin-password").value === PASSWORD) {
        localStorage.setItem("bitha_admin_session", "ok");
        afficherDashboard();
    } else { 
        alert("Mot de passe incorrect !"); 
    }
});

// 2. Auto-connexion
if(localStorage.getItem("bitha_admin_session") === "ok") {
    afficherDashboard();
}

// 3. Affichage
function afficherDashboard() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "flex";
    chargerStats(); chargerProduits(); 
}

function logout() { 
    localStorage.removeItem("bitha_admin_session"); 
    location.reload(); 
}

// 4. Navigation
function showTab(tab) {
    ['produits', 'colis', 'adresses', 'avis'].forEach(s => {
        const el = document.getElementById('section-' + s);
        if(el) el.style.display = 'none';
    });
    const section = document.getElementById('section-' + tab);
    if(section) section.style.display = 'block';

    ['produits', 'colis', 'adresses', 'avis'].forEach(s => {
        const btn = document.getElementById('tab-' + s);
        if(btn) btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('tab-' + tab);
    if(activeBtn) activeBtn.classList.add('active');

    if(tab === 'produits') chargerProduits();
    if(tab === 'colis') chargerColis();
    if(tab === 'adresses') chargerAdresses();
    if(tab === 'avis') chargerAvis();
}

// 5. Stats
async function chargerStats() {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        document.getElementById('stat-total').innerText = stats.produits;
        document.getElementById('stat-avis-attente').innerText = stats.avisAttente;
    } catch(e) {}
}

// 6. Produits
let products = [];
async function chargerProduits() {
    const res = await fetch('/api');
    products = await res.json();
    const list = document.getElementById("product-list");
    if(!list) return;
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

// 7. Colis
async function chargerColis() {
    const res = await fetch('/api/voyages');
    const voyages = await res.json();
    const list = document.getElementById("colis-list");
    if(!list) return;
    list.innerHTML = "";
    voyages.forEach(v => {
        const priceDisplay = v.devise === 'USD' ? `$ ${v.prix}/kg` : `${v.prix} FC/kg`;
        list.innerHTML += `<tr><td>${v.type_voyage}</td><td>${v.destination}</td><td>${v.date_depart}</td><td>${priceDisplay}</td><td><button class="btn-danger" onclick="deleteColis(${v.id})">X</button></td></tr>`;
    });
}

// 8. Adresses
async function chargerAdresses() {
    const res = await fetch('/api/adresses');
    const adresses = await res.json();
    const list = document.getElementById("adresse-list");
    if(!list) return;
    list.innerHTML = "";
    adresses.forEach(a => {
        list.innerHTML += `<tr><td>${a.nom_lieu}</td><td>${a.type_lieu}</td><td>${a.adresse}</td><td><button class="btn-danger" onclick="deleteAdresse(${a.id})">X</button></td></tr>`;
    });
}

// 9. Avis
async function chargerAvis() {
    const res = await fetch('/api/avis');
    const avis = await res.json();
    const list = document.getElementById("avis-list");
    if(!list) return;
    list.innerHTML = "";
    avis.forEach(a => {
        const statut = a.approuve ? "<span style='color:green;'>Publié</span>" : "<span style='color:orange;'>En attente</span>";
        const btn = a.approuve ? "" : `<button onclick="approveAvis(${a.id})" style="background:#10b981; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; margin-right:5px;">Publier</button>`;
        list.innerHTML += `<tr><td>${a.nom_client}</td><td>${'⭐'.repeat(a.note)}</td><td>${a.commentaire}</td><td>${statut}</td><td>${btn}<button class="btn-danger" onclick="deleteAvis(${a.id})">X</button></td></tr>`;
    });
}

// Fonctions annexes (Edit/Delete)
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
    document.getElementById("form-title").innerText = "Modifier";
    document.getElementById("btn-submit").innerText = "Mettre à jour";
    document.getElementById("btn-cancel").style.display = "block";
    window.scrollTo(0, 0);
}
function cancelEdit() { document.getElementById("product-form").reset(); document.getElementById("p-id").value = ""; document.getElementById("preview-img").style.display = "none"; document.getElementById("form-title").innerText = "Ajouter"; document.getElementById("btn-submit").innerText = "Enregistrer"; document.getElementById("btn-cancel").style.display = "none"; }
async function deleteProduct(id) { if (confirm("Supprimer ?")) { await fetch(`/api?id=${id}`, { method: 'DELETE' }); chargerProduits(); chargerStats(); } }
async function deleteColis(id) { if (confirm("Supprimer ?")) { await fetch(`/api/voyages?id=${id}`, { method: 'DELETE' }); chargerColis(); } }
async function deleteAdresse(id) { if (confirm("Supprimer ?")) { await fetch(`/api/adresses?id=${id}`, { method: 'DELETE' }); chargerAdresses(); } }
async function approveAvis(id) { await fetch('/api/avis', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) }); chargerAvis(); chargerStats(); }
async function deleteAvis(id) { if (confirm("Supprimer ?")) { await fetch(`/api/avis?id=${id}`, { method: 'DELETE' }); chargerAvis(); chargerStats(); } }

// Écouteurs de formulaires
document.getElementById("p-img").addEventListener("input", function() { const img = document.getElementById("preview-img"); img.src = this.value; img.style.display = this.value ? "block" : "none"; });
document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault(); const id = document.getElementById("p-id").value;
    const newProduct = { name: document.getElementById("p-name").value, price: document.getElementById("p-price").value, currency: document.getElementById("p-currency").value, desc: document.getElementById("p-desc").value, img: document.getElementById("p-img").value, category: document.getElementById("p-category").value };
    const method = id ? 'PUT' : 'POST'; if(id) newProduct.id = id;
    await fetch('/api', { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProduct) });
    cancelEdit(); chargerProduits(); chargerStats();
});
document.getElementById("colis-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newColis = { type: document.getElementById("c-type").value, destination: document.getElementById("c-dest").value, date: document.getElementById("c-date").value, price: document.getElementById("c-price").value, currency: document.getElementById("c-currency").value, desc: document.getElementById("c-desc").value, img: document.getElementById("c-img").value };
    await fetch('/api/voyages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newColis) });
    document.getElementById("colis-form").reset(); chargerColis(); alert("Programme ajouté !");
});
document.getElementById("adresse-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newAdresse = { nom: document.getElementById("a-nom").value, type: document.getElementById("a-type").value, adresse: document.getElementById("a-adresse").value };
    await fetch('/api/adresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdresse) });
    document.getElementById("adresse-form").reset(); chargerAdresses(); alert("Adresse ajoutée !");
});

