/*= toggle icon navbar =*/
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".home-navbar");

menuIcon.onclick = () => {
	menuIcon.classList.toggle("bx-x");
	navbar.classList.toggle("active-link");
};

/*= scroll active link =*/
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".item-navbar");
window.onscroll = () => {
	sections.forEach((sec) => {
		const top = window.scrollY;
		const offset = sec.offsetTop - 150;
		const heigth = sec.offsetHeight;
		const id = sec.getAttribute("id");
		if (top >= offset && top < offset + heigth) {
			navLinks.forEach((links) => {
				links.classList.remove("active-link");
				navbar
					.querySelector(".item-navbar[href*=" + id + "]")
					?.classList.add("active-link");
			});
		}
	});

	/*= remove toggle active link =*/
	menuIcon.classList.remove("bx-x");
	navbar.classList.remove("active-link");
};

/*= SCROLL REVEAL =*/
// ScrollReveal({
// 	//reset: true,
// 	distance: "80px",
// 	duration: 2000,
// 	delay: 200,
// });

// ScrollReveal().reveal(".home-content, .heading", {origin: "top"});
// ScrollReveal().reveal(
// 	".home-img, .levels-container, .overview-content, .about-container",
// 	{origin: "bottom"}
// );
// ScrollReveal().reveal(".home-content h1, .overview-img", {origin: "left"});
// ScrollReveal().reveal(".home-content p, .overview-content", {origin: "right"});

/*= TYPED JS =*/
const typed = new Typed(".multiple-text", {
	strings: ["have fun!", "learn!", "work in teams!", "interact!", "practice!"],
	typeSpeed: 100,
	backSpeed: 100,
	backDelay: 1000,
	loop: true,
});
