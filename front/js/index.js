// Appel à l'api pour afficher dynamiquement les éléments.
fetch("http://localhost:3000/api/products")
	.then((data) => {
		return data.json();
	})
	.then((response) => {
		const node = document.getElementById("items");
		for (let index = 0; index < response.length; index++) {
			// Création des différents éléments. <img>,<h3>,<p>

			let newImg = document.createElement("img");
			newImg.src = response[index].imageUrl;
			newImg.alt = response[index].altTxt;
			let newH3 = document.createElement("h3");
			newH3.textContent = response[index].name;
			let newP = document.createElement("p");
			newP.textContent = response[index].description;

			// Création de la balise <article> & Ajout des éléments dans cette balise.
			let newArticle = document.createElement("article");
			newArticle.append(newImg, newH3, newP);

			// Création de la balise <a>
			let newA = document.createElement("a");

			// Appel des canapés en dynamique.
			// newA.href = `./product.html?id=${response[index]._id}` ;
			newA.href = "./product.html?id=" + response[index]._id;
			newA.append(newArticle);

			// Ajout de élément <a> dans section Items
			node.append(newA);
		}
	})

	// Création d'un message d'erreur.
	.catch((err) => {
		console.error("err", err);
		const node = document.getElementById("items");
		let newAlertH2 = document.createElement("h2");
		newAlertH2.textContent =
			"Erreur de communication avec le serveur. Merci de contacter : support@name.com";
		node.append(newAlertH2);
	});
