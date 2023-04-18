let header = document.querySelector('.header');
let menu = document.querySelector('.burger');
let lineOne = document.querySelector('.line1');
let lineTwo = document.querySelector('.line2');

function toggle() {
    header.classList.toggle('active');
}

function animate() {
    if (header.matches('.active')){
        lineOne.style.width= "10px";
    } else {
        lineOne.style.width= "25px";
        lineTwo.style.position = "static";
    }
}

document.querySelectorAll('.header__nav-link').forEach(headerLink => {
    headerLink.addEventListener('click', toggle);
})
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


let image = document.getElementById("image-file").value;

setInterval(console.log(image), 100)


const params = new URLSearchParams(document.location.search);
const s = params.get("s");
const o = params.get("o");
console.info(s); //show C
console.info(o); //show 1
