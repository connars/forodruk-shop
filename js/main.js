let header = document.querySelector('.header');
let menu = document.querySelector('.burger');
let lineOne = document.querySelector('.line1');
let lineTwo = document.querySelector('.line2');

function toggle() {
    header.classList.toggle('active');
}

function animate() {

    if (header.matches('.active')){
        lineOne.style.transform = "rotate(45deg)";
        lineTwo.style.transform = "rotate(-45deg)";
        lineOne.style.position = "absolute";
        lineTwo.style.position = "absolute";
        menu.style.gap = "0px";
    } else {
        lineOne.style.transform = "rotate(0deg)";
        lineTwo.style.transform = "rotate(0deg)";
        lineOne.style.position = "relative";
        lineTwo.style.position = "relative";
        menu.style.gap = "8px";
    }

}

menu.addEventListener('click', toggle);
menu.addEventListener('click', animate);

