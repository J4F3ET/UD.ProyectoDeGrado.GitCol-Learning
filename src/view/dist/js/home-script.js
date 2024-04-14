/*= toggle icon navbar =*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');


//Section dialog mode
const openButtonDialog = document.querySelector('.btn-dialog');
const dialogSelectMode = document.querySelector('#dialogSelectMode');
const closeButtonDialog = document.querySelectorAll('.close_dialog');
const courseButtons = dialogSelectMode.querySelectorAll('.btn_dialog_coursel');
const modeElement = document.querySelector('[data-mode]');
const getImgInforOfMode = async (mode) => {
    const imgElement = document.createElement('img');
    const path = `dist/assets/img/home/${mode == 'single' ? 'cat_white.png' : 'cats.png'}`
    imgElement.classList.add('img_cat',mode == 'single' ? 'single' : 'multi');
    imgElement.setAttribute('loading', 'lazy');
    imgElement.setAttribute('src', path);
    imgElement.setAttribute('alt', mode == 'single' ? 'Single user mode' : 'Multi user mode');
    return imgElement;
}	
const getTextInforOfMode = async (mode) => {
    const textSingle =`
    <h3>Single user mode</h3>
    <p class="info_dialog">
        The Single User Mode allows you to freely explore the console and Git
        commands at your own pace. GitCol Learning provides preset challenges
        with on-screen guides to help you grasp the basics of Git. All of this
        takes place in an individual environment, allowing you to focus on 
        learning independently.<br>
    </p>
    <div class="item_dialog">
        <div class="icon_item_dialog"><i class='bx bxs-user'></i></div>
        <small class="tex_item_dialog">
            Free use or individual practice of the environment
        </small>
    </div>
    <div class="item_dialog">
        <div class="icon_item_dialog"><i class='bx bxs-graduation'></i></div>
        <small class="tex_item_dialog">
            Pre-set challenges with guides for learning
        </small>
    </div>`;
    const textMulti =`
    <h3 class="info_dialog">Multi user mode</h3>
    <p class="info_dialog">The Multi-user Mode allows users to freely explore the console and Git commands at their own pace. It facilitates collaboration by simulating a remote repository environment, where users can create private or public rooms for real-time collaboration
    </p>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog"><i class='bx bxs-user'></i></div>
        <small class="tex_item_dialog">
            Free use or individual practice of the environment
        </small>
    </div>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog"><i class='bx bxs-cloud'></i></div>
        <small class="tex_item_dialog">
            Simulated environment of a remote repositor
        </small>
    </div>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog"><i class='bx bxs-user-plus' ></i></div>
        <small class="tex_item_dialog">
            Real-time collaboration with others
        </small>
    </div>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog"><i class='bx bxs-home-alt-2' ></i></div>
        <small class="tex_item_dialog">
            Creation of public and private rooms
        </small>
    </div>
    `;
    return mode === 'single' ? textSingle : textMulti;
}
const getCourseInforOfMode = async (mode) => {
    return mode === 'single' ? 'Single user mode' : 'Multi user mode';
}
async function toogleMode(mode){
    const newImageElement = getImgInforOfMode(mode);
    const infoTetx = getTextInforOfMode(mode);
    const courseText = getCourseInforOfMode(mode);
    const imgElement = dialogSelectMode.querySelector('.img_cat');
    dialogSelectMode.querySelector('.dialog_block_info').innerHTML = await infoTetx;
    dialogSelectMode.querySelector('.dialog_block_img').replaceChild(await newImageElement, imgElement);
    dialogSelectMode.querySelector('.dialog_block_course').innerHTML = await courseText;
}
openButtonDialog.addEventListener('click', () => {
    dialogSelectMode.showModal();
});
courseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        toogleMode(modeElement.dataset.mode);
        modeElement.dataset.mode = modeElement.dataset.mode === 'single' ? 'multi' : 'single';
    });
});
closeButtonDialog.forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.getElementById(e.target.dataset.dialog).close();
    });
});
document.getElementById('btn_select_mode').addEventListener('click', () => {
    dialogSelectMode.close();
    document.getElementById(`dialog_${modeElement.dataset.mode==='single' ? 'multi' : 'single'}`).showModal();
});
// end section dialog mode

// ---- Section dialog single mode ----

// end section dialog single mode
// Section dialog multi mode
// end section dialog multi mode

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