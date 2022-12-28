
let listProduit = [];
const items = document.getElementById('items');
// la variable item permet d'obtenir l'element ayant l'id 'items'

const fetchApi = async (urlApi) => {
  await fetch(urlApi)
    .then((response) => response.json())
    .then((response) => (listProduit = response));
};

const afficherProduit = async () => {
  await fetchApi('http://localhost:3000/api/products/');
  listProduit.forEach((product) => {
    const a = document.createElement('a');
    a.href = `./product.html?id=${product._id}`;

    const article = document.createElement('article');

    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    const h3 = document.createElement('h3');
    h3.classList.add('productName');
    h3.textContent = product.name;

    const p = document.createElement('p');
    p.classList.add('productDescription');
    p.textContent = product.description;

    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
    a.appendChild(article);

    items.appendChild(a);
  });
};

afficherProduit();

