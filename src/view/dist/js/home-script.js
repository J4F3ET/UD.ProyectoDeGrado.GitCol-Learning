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
    <h3 class="info_dialog">Single user mode</h3>
    <p class="info_dialog">
        The Single User Mode allows you to freely explore the console and Git
            commands at your own pace. GitCol Learning provides preset challenges
            with on-screen guides to help you grasp the basics of Git. All of this
            takes place in an individual environment, allowing you to focus on 
            learning independently.<br>
    </p>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
        </div>
        <small class="tex_item_dialog">
            Free use or individual practice of the environment
        </small>
    </div>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
        </div>
        <small class="tex_item_dialog">
            Pre-set challenges with guides for learning
        </small>
    </div>`;
    const textMulti =`
    <h3 class="info_dialog">Multi user mode</h3>
    <p class="info_dialog">The Multi-user Mode allows users to freely explore the console and Git commands at their own pace. It facilitates collaboration by simulating a remote repository environment, where users can create private or public rooms for real-time collaboration
    </p>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
        </div>
        <small class="tex_item_dialog">
            Free use or individual practice of the environment
        </small>
    </div>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-fill" viewBox="0 0 16 16">
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"/>
            </svg>
        </div>
        <small class="tex_item_dialog">
            Simulated environment of a remote repositor
        </small>
    </div>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
            </svg>
        </div>
        <small class="tex_item_dialog">
            Real-time collaboration with others
        </small>
    </div>
    <div class="item_dialog info_dialog">
        <div class="icon_item_dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-lock-fill" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
                <path d="m8 3.293 4.72 4.72a3 3 0 0 0-2.709 3.248A2 2 0 0 0 9 13v2H3.5A1.5 1.5 0 0 1 2 13.5V9.293z"/>
                <path d="M13 9a2 2 0 0 0-2 2v1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1v-1a2 2 0 0 0-2-2m0 1a1 1 0 0 1 1 1v1h-2v-1a1 1 0 0 1 1-1"/>
            </svg>
        </div>
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