let allProducts = [];

fetch('/api')
    .then(res => res.json())
    .then(products => {
        allProducts = products;
        renderProducts(allProducts);
        setupFilters();
    });

function renderProducts(products) {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = "";
    if (products.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>Aucun produit dans cette catégorie.</p>";
        return;
    }
    products.forEach(p => {
        const priceDisplay = p.devise === 'USD' ? `$ ${p.prix}` : `${p.prix} FC`;
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.image_url}" alt="${p.nom}">
                <div class="product-info">
                    <h3>${p.nom}</h3>
                    <p class="desc">${p.description}</p>
                    <p class="price">${priceDisplay}</p>
                    <button class="btn-buy">Commander</button>
                </div>
            </div>
        `;
    });
    attachWhatsAppEvents();
}

function setupFilters() {
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            buttons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const text = e.target.innerText.toLowerCase();
            let filtered = allProducts;
            
            if (text.includes("nouveauté")) filtered = allProducts.filter(p => p.categorie === 'nouveaute');
            if (text.includes("promotion")) filtered = allProducts.filter(p => p.categorie === 'promotion');
            if (text.includes("meilleure")) filtered = allProducts.filter(p => p.categorie === 'best-seller');
            
            renderProducts(filtered);
        });
    });
}

function attachWhatsAppEvents() {
    document.querySelectorAll(".btn-buy").forEach(button => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".product-card");
            const name = card.querySelector("h3").innerText;
            const price = card.querySelector(".price").innerText;
            const msg = encodeURIComponent(`Bonjour SHOP BITHACOM, je souhaite commander : ${name} (${price}).`);
            window.open(`https://wa.me/243819770888?text=${msg}`, "_blank");
        });
    });
}
