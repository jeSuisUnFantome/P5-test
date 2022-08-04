let listLocalStorage = [];
if (localStorage.getItem("panier") != null) {
	listLocalStorage = JSON.parse(localStorage.getItem("panier"));
}
console.table(listLocalStorage);

// Initialiser le total du panier à 0 number
let total = 0;

// Si panier est vide affichage d'un message, sinon affichage du panier.
let empty = checkCartEmpty();
if (!empty) {
	iterateCart();
}

async function iterateCart() {
	for (let product of listLocalStorage) {
		let dataAPI = await getArticleData(product.id);
		product.name = dataAPI.name;
		product.imageUrl = dataAPI.imageUrl;
		product.altTxt = dataAPI.altTxt;
		product.price = dataAPI.price;
		console.table(product);
		createHtmlArticle(product);
	}

	updateprice();

	// Gestion de la suppression.

	document.querySelectorAll(".deleteItem").forEach((article) => {
		article.addEventListener("click", (item) => {
			// on supprime l'elem dans le HTML
			// !!! a voir sur google !!!!
			// https://developer.mozilla.org/fr/docs/Web/API/Element/closest
			item.currentTarget.closest("article").remove();

			// A partir de la page HTML, on recree le localstorage.
			updateLocalStorageFromHTML();
			checkCartEmpty();
			updateprice();
		});
	});

	document.querySelectorAll(".itemQuantity").forEach((input) => {
		input.addEventListener("change", () => {
			updateLocalStorageFromHTML();
			updateprice();
		});
	});
}

// ici c'est vide
function checkCartEmpty() {
	if (listLocalStorage.length == 0) {
		document.querySelector("#cartAndFormContainer > h1").textContent =
			"Votre panier est vide";
		return true;
	} else return false;
}

// Récuperation le contenu d'un article.

function getArticleData(articleId) {
	return fetch("http://localhost:3000/api/products/" + articleId)
		.then(function (response) {
			return response.json(); // Reponse de API
		})
		.then(function (article) {
			return article; // Valeur du précédent return json
		})
		.catch((err) => {
			// Création d'un <h2> poru afficher l'erreur.
			// let newAlertH2 = document.createElement("h2");
			// newAlertH2.textContent =
			// 	"Erreur de communication avec le serveur. Merci de contacter : support@name.com";
			// document.querySelector(".item").append(newAlertH2);
		});
}

function createHtmlArticle(product) {
	const node = document.querySelector("#cart__items");
	// Création des différents éléments. <img>,<h3>,<p>

	let newImg = document.createElement("img");
	newImg.src = product.imageUrl;
	newImg.alt = product.altTxt;
	let newDivImg = document.createElement("div");
	newDivImg.className = "cart__item__img";

	newDivImg.append(newImg);

	let NewArticle = document.createElement("article");
	NewArticle.className = "cart__item";
	NewArticle.dataset.id = product.id;
	NewArticle.dataset.color = product.colors;
	NewArticle.dataset.price = product.price;
	node.append(NewArticle);

	let newH2 = document.createElement("h2");
	newH2.textContent = product.name;
	let newcolors = document.createElement("p");
	newcolors.textContent = product.colors;
	let newPrice = document.createElement("p");
	newPrice.textContent = product.price + " €";

	let newDescription = document.createElement("div");
	newDescription.className = "cart__item__content__description";

	newDescription.append(newH2, newcolors, newPrice);

	let newQuantity = document.createElement("p");
	newQuantity.textContent = "Qté : ";

	let newInput = document.createElement("input");
	newInput.className = "itemQuantity";
	newInput.type = "number";
	newInput.min = "1";
	newInput.max = "100";
	newInput.value = product.quantity;
	newInput.name = "itemQuantity";

	let newDivSettings = document.createElement("div");
	newDivSettings.className = "cart__item__content__settings";

	let newDivQuantity = document.createElement("div");
	newDivQuantity.className = "cart__item__content__settings__quantity";
	newDivQuantity.append(newQuantity, newInput);

	let newDivDelete = document.createElement("div");
	newDivDelete.className = "cart__item__content__settings__delete";

	let newDivDeleteItem = document.createElement("p");
	newDivDeleteItem.textContent = "Supprimer";
	newDivDeleteItem.className = "deleteItem";

	newDivDelete.append(newDivDeleteItem);
	newDivSettings.append(newDivQuantity, newDivDelete);

	let newDivContent = document.createElement("div");
	newDivContent.className = "cart__item__content";

	newDivContent.append(newDescription, newDivSettings);

	NewArticle.append(newDivImg, newDivContent);
}

// Gestion du calcul du prix.
function updateprice() {
	let total = 0;
	// On met a jours le prix.
	document.querySelectorAll("article").forEach((article) => {
		let quantity = article.querySelector(".itemQuantity").value;
		let price = article.dataset.price;
		total += quantity * price;
	});
	// A partir de la page HTML, on recree le localstorage
	document.querySelector("#totalPrice").textContent = total;
}

//
function updateLocalStorageFromHTML() {
	let products = [];
	// A partir de la page HTML, on recree le localstorage
	document.querySelectorAll("article").forEach((article) => {
		const data = {
			id: article.dataset.id,
			colors: article.dataset.color,
			quantity: article.querySelector(".itemQuantity").value,
		};
		products.push(data);
	});
	//Réécriture du localStorage avec les modifications utilisateurs (converti une valeur JS en chaine JSON).
	localStorage.setItem("panier", JSON.stringify(products));
	listLocalStorage = products;
}
// id: dataId,
// colors: dataOption,
// quantity: dataQuantity,

// Regex Email
function isEmailInvalid() {
	console.log("isEmailInvalid");

	const email = document.querySelector("#email").value;
	const regex = /^[A-Za-z0-9+_.-]+@(.+)$/;
	if (regex.test(email) === false) {
		document.querySelector("#emailErrorMsg").textContent =
			"Entrez un adresse Email valide";
		return true;
	}
	document.querySelector("#emailErrorMsg").textContent = "";
	return false;
}

// Regex form
function isFormInvalid() {
	console.log("isFormInvalid");
	const form = document.querySelector("form");
	const inputs = form.querySelectorAll(".cart__order__form__question > input");
	let status = false;
	inputs.forEach((input) => {
		if (input.value === "") {
			input.closest("div").querySelector("p").textContent =
				"Veuillez remplir ce champ";
			status &= true;
		} else {
			input.closest("div").querySelector("p").textContent = "";
			status &= false;
		}
	});
	return status;
}

//récuperer les informations de la page panier nom,prenomn,ville)

function dataForm(arrayId) {
	const form = document.querySelector("form");
	const firstName = form.elements.firstName.value;
	const lastName = form.elements.lastName.value;
	const address = form.elements.address.value;
	const city = form.elements.city.value;
	const email = form.elements.email.value;

	// stocker dans un dictionnaire
	const dataInformation = {
		contact: {
			firstName: firstName,
			lastName: lastName,
			address: address,
			city: city,
			email: email,
		},
		products: arrayId, //id des produits contenus dans la commande
	};
	// pour recuperer mon dictionnaire ailleur.
	formCommand(dataInformation);
	// remonter l'objet a celui qui appel.
}
//products: [string] <-- array of product _id

document.querySelector("#order").addEventListener("click", () => {
	let ret2 = isFormInvalid();
	let ret1 = isEmailInvalid();

	if (!ret1 && !ret2) {
		dataForm(getProductsForForm());
	}
});

// Recuperation des id des articles,dans l'envoi du Formulaire.
function getProductsForForm() {
	let arrayId = [];
	document.querySelectorAll("article").forEach((article) => {
		arrayId.push(article.dataset.id);
	});
	return arrayId;
}

function formCommand(dataInformation) {
	fetch("http://localhost:3000/api/products/order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(dataInformation),
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
			let orderId = data.orderId;
			localStorage.removeItem("panier");
			window.location.href = "confirmation.html?id=" + orderId;
		})
		.catch((error) => console.log(error));
}
