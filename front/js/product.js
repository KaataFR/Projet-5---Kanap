

const imgClass = document.getElementsByClassName('item__img');
const titleId = document.getElementById('title');
const priceId = document.getElementById('price');
const descriptionId = document.getElementById('description');
const colorsId = document.getElementById('colors');

const idDuProduit = new URL(location.href).searchParams.get('id');

let produit;

const recupProduit = async (urlApi, idProduit) => {
    // permet de recuperer les données dans l'API selon l'id du produit
    await fetch(urlApi + idProduit)
        .then((response) => response.json())
        .then((response) => (produit = response));
};

const afficherProduit = async () => {
    // fonction pour afficher le produit selon l'id
    await recupProduit('http://localhost:3000/api/products/', idDuProduit);
    // on a recuperer l'url du produit et l'id du produit

    // Image
    const image = document.createElement('img');
    image.src = produit.imageUrl;
    image.alt = produit.altTxt;
    console.log(image);
    console.log(imgClass);
    imgClass[0].appendChild(image);

    // Titre
    const title = document.createElement('h1');
    title.textContent = produit.name;
    console.log(title);
    titleId.appendChild(title);

    // Description

    const description = document.createElement('p');
    description.textContent = produit.description;
    console.log(description);
    descriptionId.appendChild(description);

    // Prix

    const price = document.createTextNode(produit.price);
    console.log(price);
    priceId.appendChild(price);

    // Couleurs

    let min = 0;
    let max = produit.colors.length - 1;

    console.log(max);

    for (let i = min; i <= max; i++) {
        const option = document.createElement('option');
        option.value = produit.colors[i];
        option.textContent = produit.colors[i];
        colorsId.appendChild(option);
    }


}


afficherProduit();

// --------------------------------------  partie sur le bouton ajouter panier 





// Obtenir les informations des quantités , des couleurs


// Quantité
const quantiteValue = () => {
    let quantite = document.getElementById("quantity");
    if (quantite.value < 1 || quantite.value > 100 || parseInt(quantite.value) != quantite.value || quantite.value === "") {
        return false;
    } else {
        return quantite.value;
    }
}

// Couleurs
const ColorValue = () => {
    let couleur = document.getElementById("colors");
    if (couleur.value === undefined || couleur.value === "") {
        return false;
    } else {
        return couleur.value;
    }
}





// ---------------- BOUTON PANIER 

let articlePanier = [];
const ajoutPanier = document.getElementById("addToCart");


// Clique sur le Bouton Panier
ajoutPanier.addEventListener("click", () => {

    let quantite = quantiteValue();
    let color = ColorValue();

    console.log("la couleur est  " + color + ", la quantité est de " + quantite);

    if (color === false || quantite === false) {

        alert("Choisissez une couleur ou une quantité");

    } else {
        articlePanier = { idDuProduit, color, quantite };

        let storage = JSON.parse(localStorage.getItem("article"));

        alert(" Article ajouté au panier !")

        console.log(localStorage);

        // Initialiser le premier article du panier
        if (storage == undefined || storage == null) {
            storage = [articlePanier];
            localStorage.setItem("article", JSON.stringify([articlePanier])); // 1er article
        } else {
            var test = storage.filter(function (currentStorage) {
                // on verifie si l'article ajouté est le même qu'un article deja stocké dans le tableau du localStorage
                return currentStorage.idDuProduit === articlePanier.idDuProduit && currentStorage.color === articlePanier.color;
            });
            console.log(test);
            if (test.length === 0) {
                storage.push(articlePanier);
            } else {
                // Si il existe un même article avec même couleur, alors on additionne leurs quantitées
                test[0].quantite = Number(test[0].quantite);

                test[0].quantite += Number(articlePanier.quantite);

            }
            localStorage.setItem("article", JSON.stringify(storage));

        }

    }
});




