from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.units import cm

def generer_guide():
    pdf_filename = "Guide_SHOP_BITHACOM.pdf"
    doc = SimpleDocTemplate(pdf_filename, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
    
    styles = getSampleStyleSheet()
    
    # Styles personnalisés
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=26, textColor=HexColor('#1e3a8a'), spaceAfter=10, alignment=1)
    subtitle_style = ParagraphStyle('SubtitleStyle', parent=styles['Heading2'], fontSize=14, textColor=HexColor('#64748b'), spaceAfter=30, alignment=1)
    h2_style = ParagraphStyle('H2Style', parent=styles['Heading2'], fontSize=16, textColor=HexColor('#3b82f6'), spaceBefore=20, spaceAfter=10)
    body_style = ParagraphStyle('BodyStyle', parent=styles['Normal'], fontSize=11, leading=16, spaceAfter=8)
    code_style = ParagraphStyle('CodeStyle', parent=styles['Normal'], fontSize=11, fontName='Courier', textColor=HexColor('#ef4444'), backColor=HexColor('#f1f5f9'), borderPadding=5)
    
    elements = []
    
    # En-tête
    elements.append(Paragraph("SHOP BITHACOM", title_style))
    elements.append(Paragraph("Guide d'utilisation de l'Espace Administrateur", subtitle_style))
    elements.append(Spacer(1, 20))
    
    # 1. Accès
    elements.append(Paragraph("1. Accès à l'Espace Admin", h2_style))
    elements.append(Paragraph("<b>Lien :</b> https://shop-bithacom.pages.dev/admin.html", body_style))
    elements.append(Paragraph("<b>Mot de passe :</b> bitha2025", body_style))
    elements.append(Paragraph("Ne partagez jamais ce mot de passe, il donne accès à toute la gestion de la boutique.", body_style))
    
    # 2. Produits
    elements.append(Paragraph("2. Gestion des Produits", h2_style))
    elements.append(Paragraph("Cliquez sur l'onglet 'Produits' dans le menu de gauche.", body_style))
    elements.append(Paragraph("Pour ajouter un produit, remplissez : Nom, Prix, Devise, Catégorie, Lien image (via postimages.org) et Description.", body_style))
    elements.append(Paragraph("Utilisez le bouton bleu 'Modifier' pour changer un produit ou le bouton rouge 'X' pour le supprimer.", body_style))
    
    # 3. Colis
    elements.append(Paragraph("3. Agence de Colis", h2_style))
    elements.append(Paragraph("L'onglet 'Agence de Colis' gère les envois aériens, maritimes et terrestres.", body_style))
    elements.append(Paragraph("Remplissez : Type, Destination, Date, Prix/kg, Devise et Description.", body_style))
    elements.append(Paragraph("Les programmes s'affichent automatiquement sur la page 'Agence de Colis' du site public.", body_style))
    
    # 4. Adresses
    elements.append(Paragraph("4. Gestion des Adresses", h2_style))
    elements.append(Paragraph("L'onglet 'Adresses' permet d'ajouter les boutiques et agences.", body_style))
    elements.append(Paragraph("Remplissez : Nom du lieu, Type (Boutique/Agence/Entrepôt) et Adresse complète.", body_style))
    elements.append(Paragraph("Toutes les adresses apparaissent sur la page 'Contact' avec une carte Google Maps.", body_style))
    
    # 5. Avis
    elements.append(Paragraph("5. Avis Clients", h2_style))
    elements.append(Paragraph("L'onglet 'Avis Clients' centralise les retours des clients.", body_style))
    elements.append(Paragraph("Cliquez sur 'Publier' pour afficher un avis sur la page d'accueil, ou 'X' pour le supprimer.", body_style))
    
    # 6. Commandes WhatsApp
    elements.append(Paragraph("6. Commandes via WhatsApp", h2_style))
    elements.append(Paragraph("Toutes les commandes arrivent automatiquement sur le WhatsApp : +243 819 770 888", body_style))
    elements.append(Paragraph("Les messages sont pré-remplis avec les produits choisis et le mode de livraison.", body_style))
    
    # Pied de page
    elements.append(Spacer(1, 40))
    elements.append(Paragraph("© 2026 SHOP BITHACOM - Tous droits réservés", ParagraphStyle('Footer', parent=body_style, fontSize=9, textColor=HexColor('#94a3b8'), alignment=1)))
    
    doc.build(elements)
    print(f"✅ PDF généré avec succès : {pdf_filename}")

if __name__ == "__main__":
    generer_guide()
