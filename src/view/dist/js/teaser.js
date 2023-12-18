console.log(document.getElementById("tittle"));
const parallaxTitle = new Parallax(document.getElementById("tittle"), {
	hoverOnly: true,
});
const parallaxBoton = new Parallax(document.querySelector(".boton"), {
	pointerEvents: true,
});
parallaxBoton.setInputElement(document.getElementById("btnEntrar"));
const parallaxInstanceCat = new Parallax(document.getElementById("cat"));
const parallaxInstanceFireBalls = new Parallax(
	document.getElementById("sceneFireballs"),
	{
		hoverOnly: true,
	}
);
const parallaxInstanceGrass = new Parallax(
	document.getElementById("grassGroupParallax"),
	{
		invertX: true,
		invertY: true,
	}
);
document
	.getElementById("grassGroup")
	.animate([{transform: "translateX(-1%)"}, {transform: "translateX(1%)"}], {
		duration: 5000,
		iterations: Infinity,
		direction: "alternate",
	});
document.querySelectorAll(".individualGrass").forEach((grass) => {
	grass.animate(
		[{transform: "translateY(0)"}, {transform: "translateY(10%)"}],
		{
			duration: 4000,
			iterations: Infinity,
			direction: "alternate",
		}
	);
});
