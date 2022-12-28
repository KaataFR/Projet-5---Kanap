/*
  La fonction receptionDuNumeroDeCommande affiche à l'utilisateur son numéro de commande.
  et supprime la commande du localStorage par mesure de sécurité.
 */

  function confirmationCommande() {
    const orderId = document.getElementById('orderId');
    const orderIdText = document.createTextNode(localStorage.getItem('orderId'));
    orderId.appendChild(orderIdText);
    localStorage.clear();
  }
  
  confirmationCommande();
  

