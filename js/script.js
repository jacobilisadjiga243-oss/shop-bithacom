// ===== 1. BOUTON COMMANDER VIA WHATSAPP =====
// Met à jour le lien WhatsApp sur tous les boutons "Commander"
document.addEventListener("DOMContentLoaded", () => {
    const phoneNumber = "243819770888"; // Ton numéro sans le +
    const buyButtons = document.querySelectorAll(".btn-buy");

    buyButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            // Récupère le nom du produit
            const productCard = e.target.closest(".product-card");
            const productName = productCard.querySelector("h3").innerText;
            const productPrice = productCard.querySelector(".price").innerText;
            
            // Crée le message WhatsApp
            const message = encodeURIComponent(`Bonjour BITHACOM Shop, je souhaite commander : ${productName} (${productPrice}).`);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            // Ouvre WhatsApp
            window.open(whatsappUrl, "_blank");
        });
    });
});

// ===== 2. BARRE DE RECHERCHE =====
const searchInput = document.querySelector(".search-bar input");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll(".product-card");

        products.forEach(product => {
            const title = product.querySelector("h3").innerText.toLowerCase();
            const desc = product.querySelector(".desc").innerText.toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                product.style.display = "flex"; // Affiche
            } else {
                product.style.display = "none"; // Cache
            }
        });
    });
}

// ===== 3. FILTRES CATÉGORIES =====
const filterButtons = document.querySelectorAll(".filters button");
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Retire la classe "active" de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove("active"));
        // Ajoute "active" au bouton cliqué
        button.classList.add("active");

        // Ici, on pourrait ajouter une vraie logique de filtrage par catégorie
        // Pour l'instant, on affiche juste tous les produits
        const products = document.querySelectorAll(".product-card");
        products.forEach(p => p.style.display = "flex");
    });
});

// ===== 4. FORMULAIRE CONTACT VIA WHATSAPP =====
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Empêche l'envoi classique du formulaire

        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const message = contactForm.querySelector("textarea").value;

        const text = encodeURIComponent(`Message de BITHACOM Shop :\nNom : ${name}\nEmail : ${email}\nTéléphone : ${phone}\n\nMessage : ${message}`);
        const whatsappUrl = `https://wa.me/243819770888?text=${text}`;

        window.open(whatsappUrl, "_blank");
    });
}
