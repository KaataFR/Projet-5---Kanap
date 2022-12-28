
let contenuPanier = ""
let cartItems = document.getElementById("cart__items")
let produit;

let storage = JSON.parse(localStorage.getItem("article"));

let i = 0;

let totalPrice = 0;
let totalQuantity = 0;

let totalPriceId = document.getElementById("totalPrice");
let totalQuantityId = document.getElementById("totalQuantity");




if (!storage || storage == 0) {
  let message = document.createElement('p');
  message.textContent = "Votre panier est vide";
  message.style.textAlign = "center";
  message.style.fontSize = "25px";
  message.style.fontStyle = "italic";
  cartItems.appendChild(message);
} else {





  const recupProduit = async (urlApi) => { // permet de recuperer les données dans l'API selon l'id du produit
    await fetch(urlApi)
      .then(response => response.json())
      .then(response => produit = response)
  }

  const afficherProduit = async () => {
    // fonction pour associer le produit selon l'id
    await recupProduit('http://localhost:3000/api/products/');

    for (let i = 0; storage.length > i; i++) {
      const product = produit.filter(
        (currentProduct, index) => currentProduct._id === storage[i].idDuProduit
      );

      const article = document.createElement('article');
      article.classList.add('cart__item');
      article.dataset.id = storage[i].idDuProduit;
      article.dataset.color = storage[i].color;

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('cart__item__img');

      const img = document.createElement('img');
      img.src = product[0].imageUrl;
      img.alt = product[0].altTxt;

      imgDiv.appendChild(img);
      article.appendChild(imgDiv);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('cart__item__content');

      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('cart__item__content__description');

      const h2 = document.createElement('h2');
      h2.textContent = product[0].name;

      const pColor = document.createElement('p');
      pColor.textContent = storage[i].color;

      const pPrice = document.createElement('p');
      pPrice.textContent = `${product[0].price} €`;

      descriptionDiv.appendChild(h2);
      descriptionDiv.appendChild(pColor);
      descriptionDiv.appendChild(pPrice);

      const settingsDiv = document.createElement('div');
      settingsDiv.classList.add('cart__item__content__settings');

      const quantityDiv = document.createElement('div');
      quantityDiv.classList.add('cart__item__content__settings__quantity');

      const pQuantity = document.createElement('p');
      pQuantity.textContent = 'Qté :';

      const inputQuantity = document.createElement('input');
      inputQuantity.type = 'number';
      inputQuantity.classList.add('itemQuantity');
      inputQuantity.name = 'itemQuantity';
      inputQuantity.min = '1';
      inputQuantity.max = '100';
      inputQuantity.value = storage[i].quantite;

      quantityDiv.appendChild(pQuantity);
      quantityDiv.appendChild(inputQuantity);

      const deleteDiv = document.createElement('div');
      deleteDiv.classList.add('cart__item__content__settings__delete');

      const pDelete = document.createElement('p');
      pDelete.classList.add('deleteItem');
      pDelete.textContent = 'Supprimer';

      deleteDiv.appendChild(pDelete);

      settingsDiv.appendChild(quantityDiv);
      settingsDiv.appendChild(deleteDiv);

      contentDiv.appendChild(descriptionDiv);

      contentDiv.appendChild(settingsDiv);
      article.appendChild(contentDiv);
      cartItems.appendChild(article);

      totalQuantity += Number(storage[i].quantite);

      totalPrice += product[0].price * Number(storage[i].quantite);

      totalPriceId.textContent = totalPrice;
      totalQuantityId.textContent = totalQuantity;
    };




  }

  afficherProduit().then(() => {
    deleteProduct();
    modifyProduct();
  });







  // ----------------------------   Supprimer l'article




  const deleteProduct = async () => {

    // variable qui va chercher tous les paragraphes avec la class .deleteItem

    let btnDelete = await document.querySelectorAll('.deleteItem');

    console.log(btnDelete);

    for (let l = 0; l < btnDelete.length; l++) {

      // lors du clique du bouton supprimer

      btnDelete[l].addEventListener("click", () => {

        // la variable prend la valeur  de la couleur dans le local storage 
        let suppressionProduits = storage[l].color;

        // la variable storage est filtré est ne garde que les produit ayant une couleur non supprimé
        storage = storage.filter((product) => product.color !== suppressionProduits);

        // on envoit les nouvelles valeurs dans le local storage
        localStorage.setItem("article", JSON.stringify(storage));

        alert("Le produit a été supprimé !");
        // On recharge la page pour visualiser les changements    
        // location.reload();

        btnDelete[l].closest("article").remove();

        location.reload();


      });
    }
  };

  deleteProduct();










  // ----------------------------    Modifier l'article 


  const modifyProduct = () => {
    // variable qui va chercher tous les paragraphes avec la class .itemQuantity
    const modifQteProduit = document.querySelectorAll('.itemQuantity');

    console.log(modifQteProduit);

    for (let qty = 0; qty < storage.length; qty++) {
      // lors du clique du changement de valeur des articles
      modifQteProduit[qty]?.addEventListener('change', (event) => {
        event.preventDefault();

        // initialise une variable qui prend la valeur de la quantite choisie
        let modifQteValeur = modifQteProduit[qty].valueAsNumber;
        console.log(modifQteValeur);

        // Si la quantité est négative, on affiche une alerte et on ne modifie pas la quantité
        if (modifQteValeur < 0) {
          alert('La quantité ne peut pas être négative !');
          return;
        }

        // on modifie la quantité dans le local storage
        storage[qty].quantite = modifQteValeur;

        // on change la valeur dans le LocalStorage
        localStorage.setItem('article', JSON.stringify(storage));

        alert('Quantité modifié !');

        // on actualise pour que les changements soient visible.
        location.reload();
      });
    }
  };

  modifyProduct();








  /// ------------------------------------- Formulaire 

  let formulaireValide = false;

  let firstNameValide = false;
  let lastNameValide = false;
  let villeValide = false;
  let adresseValide = false;
  let emailValide = false;

  const controleDuFormulaire = async () => {

    const cartOrderForm = await document.querySelector(".cart__order__form");





    const emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
    const adresseRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
    const nomPrenomVilleRegExp = new RegExp("^[a-zA-Z ,.'-]+$");

    //Ecoute d'événement sur la modification du champ Prénom.
    cartOrderForm.firstName.addEventListener("change", function () {
      validFirstName(this);
    });

    //Ecoute d'événement sur la modification du champ Nom.
    cartOrderForm.lastName.addEventListener("change", function () {
      validLastName(this);
    });

    //Ecoute d'événement sur la modification du champ Adresse.
    cartOrderForm.address.addEventListener("change", function () {
      validAddress(this);
    });

    //Ecoute d'événement sur la modification du champ Ville.
    cartOrderForm.city.addEventListener("change", function () {
      validCity(this);
    });

    //Ecoute d'événement sur la modification du champ Email.
    cartOrderForm.email.addEventListener("change", function () {
      validEmail(this);
    });


    let firstNameErrorMsg = document.createElement('p');
    let lastNameErrorMsg = document.createElement('p');
    let addressErrorMsg = document.createElement('p');
    let cityErrorMsg = document.createElement('p');
    let emailErrorMsg = document.createElement('p');





    const validFirstName = function (inputFirstName) {
      // si le test est vrai, ne pas afficher de message d'erreur, sinon définir le contenu du texte 
      // de l'élément de message d'erreur et l'ajouter après l'élément d'input
      if (nomPrenomVilleRegExp.test(inputFirstName.value)) {
        // si l'élément de message d'erreur a déjà été ajouté au DOM, le supprimer
        if (firstNameErrorMsg.parentNode === inputFirstName.parentNode) {
          inputFirstName.parentNode.removeChild(firstNameErrorMsg);
        }
        firstNameValide = true;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Prénom = " + firstNameValide);
        console.log("Le formulaire est " + formulaireValide);
      } else {
        firstNameErrorMsg.textContent = "Prénom incorrect.";
        inputFirstName.parentNode.appendChild(firstNameErrorMsg);
        firstNameValide = false;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Prénom = " + firstNameValide);
        console.log("Le formulaire est " + formulaireValide);
      }
    };


    //validation du NOM
    const validLastName = function (inputLastName) {

      if (nomPrenomVilleRegExp.test(inputLastName.value)) {
        // si l'élément de message d'erreur a déjà été ajouté au DOM, le supprimer
        if (lastNameErrorMsg.parentNode === inputLastName.parentNode) {
          inputLastName.parentNode.removeChild(lastNameErrorMsg);
        }
        lastNameValide = true;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Nom = " + lastNameValide);
        console.log("Le formulaire est " + formulaireValide);
      } else {
        lastNameErrorMsg.textContent = "Nom incorrect.";
        inputLastName.parentNode.appendChild(lastNameErrorMsg);
        lastNameValide = false;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Nom = " + lastNameValide);
        console.log("Le formulaire est " + formulaireValide);
      }
    };


    //validation de l'ADRESSE
    const validAddress = function (inputAddress) {

      if (adresseRegExp.test(inputAddress.value)) {
        // si l'élément de message d'erreur a déjà été ajouté au DOM, le supprimer
        if (addressErrorMsg.parentNode === inputAddress.parentNode) {
          inputAddress.parentNode.removeChild(addressErrorMsg);
        }
        adresseValide = true;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Adresse = " + adresseValide);
        console.log("Le formulaire est " + formulaireValide);
      } else {
        addressErrorMsg.textContent = "Adresse incorrect.";
        inputAddress.parentNode.appendChild(addressErrorMsg);
        adresseValide = false;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Adresse = " + adresseValide);
        console.log("Le formulaire est " + formulaireValide);
      }
    };


    //validation de la VILLE
    const validCity = function (inputCity) {

      if (nomPrenomVilleRegExp.test(inputCity.value)) {
        // si l'élément de message d'erreur a déjà été ajouté au DOM, le supprimer
        if (cityErrorMsg.parentNode === inputCity.parentNode) {
          inputCity.parentNode.removeChild(cityErrorMsg);
        }
        villeValide = true;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Ville = " + villeValide);
        console.log("Le formulaire est " + formulaireValide);
      } else {
        cityErrorMsg.textContent = "Ville incorrect.";
        inputCity.parentNode.appendChild(cityErrorMsg);
        villeValide = false;
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Ville = " + villeValide);
        console.log("Le formulaire est " + formulaireValide);
      }
    };


    //validation de l'EMAIL
    const validEmail = function (inputEmail) {

      if (emailRegExp.test(inputEmail.value)) {
        // si l'élément de message d'erreur a déjà été ajouté au DOM, le supprimer
        if (emailErrorMsg.parentNode === inputEmail.parentNode) {
          inputEmail.parentNode.removeChild(emailErrorMsg);
        }
        emailValide = true;
        console.log("Email = " + emailValide);
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Le formulaire est " + formulaireValide);
      } else {
        emailErrorMsg.textContent = "Email incorrect.";
        inputEmail.parentNode.appendChild(emailErrorMsg);
        emailValide = false;
        console.log("Email = " + emailValide);
        formulaireValide = emailValide && villeValide && adresseValide && lastNameValide && firstNameValide;
        console.log("Le formulaire est " + formulaireValide);
      }
    };



  }

  controleDuFormulaire();


  // Bouton Commander <----------



  // ------------ On récupere toutes les valeurs dans un tableau pour confirmer la commande





  const envoiCommande = () => {

    const recupPanier = document.getElementById("order");


    recupPanier.addEventListener('click', (event) => {

      if (formulaireValide == false) {
        alert("Formulaire Incorrect");
        event.preventDefault()
        location.reload()
      } else {
        alert("Félicitations, votre commande a été passée avec succès");

        // on récupère les données du formulaire

        const contact = {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        }

        // boucle for pour recuperer tous les id des produits présents dans la page panier

        let products = [];

        for (i = 0; i < storage.length; i++) {
          products.push(storage[i].idDuProduit)
        };
        console.log((products));



        // On récupere dans une variable les données du formulaire et des id 

        const order = { contact, products };
        console.log(order);


        // ---------  Envoyer les données dans l'API 

        const requete = {
          method: "POST",
          body: JSON.stringify(order),
          headers: {
            'Content-Type': 'application/json'
          }
        };



        fetch("http://localhost:3000/api/products/order", requete)
          .then((response) => response.json())
          // Stocke l'ID de commande dans le localStorage du navigateur
          // et redirige l'utilisateur vers la page de confirmation de commande
          // en utilisant l'ID de commande comme paramètre de l'URL.
          .then((apiData) => {
            localStorage.setItem('orderId', apiData.orderId);
            document.location.href = `confirmation.html?id=${apiData.orderId}`;
          })
          // Affiche un message d'alerte et l'erreur dans la console
          // en cas d'échec de la requête HTTP.
          .catch((erreur) => {
            alert(`Erreur: ${erreur}`);
            console.log(erreur);
          });


      }
    }
    );


  }

  envoiCommande();


}