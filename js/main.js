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
        lineOne.style.position = "static";
        lineTwo.style.position = "static";
        menu.style.gap = "8px";
        lineOne.style.transform = "rotate(0deg)";
        lineTwo.style.transform = "rotate(0deg)";
    }

}

menu.addEventListener('click', toggle);
menu.addEventListener('click', animate);

let themes = document.querySelector('.themes');
let picker = document.querySelector('.pick');

function openThemes() {
    themes.classList.toggle('active');
    picker.classList.toggle('active')
}

picker.addEventListener('click', openThemes);

let secondTheme = document.querySelector('.theme-two');

function changeTheme() {

}

secondTheme.addEventListener('click', changeTheme)

