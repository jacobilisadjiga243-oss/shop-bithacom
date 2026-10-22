fetch('/api')
    .then(response => response.json())
    .then(products => {
        const grid = document.querySelector('.products-grid');
        grid.innerHTML = "";
        
        if (products.length === 0) {
            grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Aucun produit pour le moment.</p>";
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
    .catch(err => console.log("Erreur:", err));
