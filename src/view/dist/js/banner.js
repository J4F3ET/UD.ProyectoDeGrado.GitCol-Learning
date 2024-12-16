fetch("./dist/assets/banner.txt")
	.then((response) => response.text())
	.then((text) => {
		console.log(text);
	})
	.catch((error) => console.error("Error al leer el archivo:", error));
