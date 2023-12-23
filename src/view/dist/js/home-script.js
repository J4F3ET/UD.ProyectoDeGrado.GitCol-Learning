/*= toggle icon navbar =*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active-link');
}

/*= scroll active link =*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let heigth = sec.offsetHeight;
        let id = sec.getAttribute('id');
        if(top >= offset && top < offset + heigth) {
            navLinks.forEach(links => {
                links.classList.remove('active-link');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active-link');
            });
        };
    });

    /*= remove toggle active link =*/
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active-link');
};

/*= SCROLL REVEAL =*/
ScrollReveal({
    //reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top'});
ScrollReveal().reveal('.home-img, .levels-container, .overview-content, .about-container',{ origin: 'bottom'});
ScrollReveal().reveal('.home-content h1, .overview-img', { origin: 'left'});
ScrollReveal().reveal('.home-content p, .overview-content', { origin: 'right'});

/*= TYPED JS =*/
const typed = new Typed('.multiple-text', {
    strings: ['have fun!','learn!','work in teams!','interact!','practice!'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});