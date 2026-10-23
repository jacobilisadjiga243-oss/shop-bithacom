fetch('/api')
    .then(response => response.json())
    .then(products => {
        const grid = document.querySelector('.products-grid');
        grid.innerHTML = "";
        
        if (products.length === 0) {
            grid.innerHTML = "<div style='text-align:center; grid-column: 1/-1; padding: 40px;'><h3 style='color:#1e3a8a;'>Aucun produit disponible pour le moment.</h3><p style='color:#666; margin-top:10px;'>Revenez bientôt !</p></div>";
            return;
        }

        products.forEach(p => {
            const priceDisplay = p.devise === 'USD' ? `$ ${p.prix}` : `${p.prix} FC`;
            grid.innerHTML += `
                <div class="product-card">
                    <img src="${p.image_url}" alt="${p.nom}" loading="lazy">
                    <div class="product-info">
                        <h3>${p.nom}</h3>
                        <p class="desc">${p.description}</p>
                        <p class="price">${priceDisplay}</p>
                        <button class="btn-buy">Commander</button>
                    </div>
                </div>
            `;
        });
        
        document.querySelectorAll(".btn-buy").forEach(button => {
            button.addEventListener("click", (e) => {
                const productCard = e.target.closest(".product-card");
                const productName = productCard.querySelector("h3").innerText;
                const productPrice = productCard.querySelector(".price").innerText;
                const message = encodeURIComponent(`Bonjour SHOP BITHACOM, je souhaite commander : ${productName} (${productPrice}).`);
                window.open(`https://wa.me/243819770888?text=${message}`, "_blank");
            });
        });
    })
    .catch(err => {
        document.querySelector('.products-grid').innerHTML = "<p style='text-align:center; grid-column: 1/-1; color:red;'>Erreur de chargement des produits.</p>";
        console.log("Erreur:", err);
    });
