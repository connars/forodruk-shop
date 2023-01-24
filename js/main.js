let header = document.querySelector('.header');
let menu = document.querySelector('.burger');

function toggle() {
    header.classList.toggle('active');
    console.log('click');
}

menu.addEventListener('click', toggle)
