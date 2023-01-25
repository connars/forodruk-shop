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

let firstTheme = document.querySelector('.color-one');
let secondTheme = document.querySelector('.color-two');

const root = document.querySelector(':root');
function changeTheme() {
    if(firstTheme.matches('.current-theme')) {
        firstTheme.classList.remove('current-theme');
        root.style.setProperty('--green', 'rgb(147, 42, 207)');
        root.style.setProperty('--bg', 'rgb(230, 217, 238)');
        secondTheme.classList.add('current-theme');
    } else {

    }
};

function changeTheme2() {
    if(secondTheme.matches('.current-theme')) {
        secondTheme.classList.remove('current-theme');
        root.style.setProperty('--green', '#8BC34A');
        root.style.setProperty('--bg', '#F9FCF6');
        firstTheme.classList.add('current-theme');
    }else {
        
    }
};

secondTheme.addEventListener('click', changeTheme);
firstTheme.addEventListener('click', changeTheme2);

// changeTheme()

let standart = document.querySelector('.slide-one');
let unstandart = document.querySelector('.slide-two');

let currentSlideValue = document.querySelector('.current__slide');

let changeSlideValueLeft = document.querySelector('.swiper-button-prev3');
let changeSlideValueRight = document.querySelector('.swiper-button-next3');

function changeSlideTitle() {
    if(standart.matches('.swiper-slide-active')) {
        currentSlideValue.innerHTML = 'Стандартні <br/> розміри';
    } else {
        currentSlideValue.innerHTML = 'Нестандартні <br/> розміри'
    } 
}


;

setInterval(changeSlideTitle,100)

