fetch('products.json')
    .then(response => {
        if (!response.ok) throw new Error('Fichier JSON non trouvé');
        return response.json();
    })
    .then(data => {
        const grid = document.querySelector('.products-grid');
        grid.innerHTML = "";
        
        data.forEach(p => {
            // Gestion de la devise
            const priceDisplay = p.currency === 'USD' ? `$ ${p.price}` : `${p.price} FC`;
            const badgeClass = p.currency === 'USD' ? 'currency-usd' : 'currency-fc';
            const badgeText = p.currency === 'USD' ? '$' : 'FC';

            grid.innerHTML += `
                <div class="product-card">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        <p class="desc">${p.desc}</p>
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
    .catch(err => console.log("Mode local : utilisation des produits par défaut.", err));
