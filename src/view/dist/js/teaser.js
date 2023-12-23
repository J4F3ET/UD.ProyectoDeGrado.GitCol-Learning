const titleParallax = new Parallax(document.getElementById("tittle"), {
	hoverOnly: true,
});
const botonParallax = new Parallax(document.querySelector(".boton"), {
	pointerEvents: true,
});
botonParallax.setInputElement(document.getElementById("btnEntrar"));
const catParallax = new Parallax(document.getElementById("cat"),{
	pointerEvents: true,
});
const fireBallsParallax = new Parallax(
	document.getElementById("sceneFireballs"),
	{hoverOnly: true}
);
const grassParallax = new Parallax(
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
document
	.getElementById("individualFireball")
	.animate(
		[
			{transform: "translateX(-2px)"},
			{transform: "translateX(2px)"},
			{transform: "translateY(-2px)"},
			{transform: "translateY(2px)"},
		],
		{
			duration: 100,
			iterations: Infinity,
			direction: "alternate",
		}
	);
document.getElementById("btnEntrar").addEventListener("click", () => {
	window.location.href = "/login";
});
