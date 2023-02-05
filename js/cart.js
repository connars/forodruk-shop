
let cart = document.querySelector('.upload__main-sidebar');

document.querySelector('.footer-button').addEventListener('click',() => {
    if (cart.classList.contains('active')) {
        cart.classList.remove('active')
    } else {
        cart.classList.add('active')
    }
})

document.querySelector('.upload__sidebar-exit').addEventListener('click',() => {
    if (cart.classList.contains('active')) {
        cart.classList.remove('active')
    } else {
        cart.classList.add('active')
    }
});

let accordionItem = document.querySelectorAll('.sidebar__accordion-title');
let formInput = 1;
let check = document.querySelectorAll('.check');

accordionItem[0].addEventListener('click', () => {
    if(accordionItem[0].classList.contains('active')) {
        accordionItem[0].classList.remove('active')
        check[0].classList.add('active')
    } else {
        check[0].classList.remove('active')
        accordionItem[0].classList.add('active')  
        accordionItem[1].classList.remove('active')
        accordionItem[2].classList.remove('active')
    }
})

accordionItem[1].addEventListener('click', () => {
    if(accordionItem[1].classList.contains('active')) {
        accordionItem[1].classList.remove('active')
    } else {
        check[0].classList.add('active')
        check[1].classList.remove('active')
        accordionItem[0].classList.remove('active')
        accordionItem[1].classList.add('active')
        accordionItem[2].classList.remove('active')
    }
})

accordionItem[2].addEventListener('click', () => {
    if(accordionItem[2].classList.contains('active')) {
        accordionItem[2].classList.remove('active');
       
    } else if(accordionItem[0].classList.contains('active')){
        accordionItem[1].classList.add('active')
        accordionItem[0].classList.remove('active')
    } else if (formInput == '') {
        alert('Заполните форму')
    } else {
        accordionItem[0].classList.remove('active')
        accordionItem[1].classList.remove('active')
        accordionItem[2].classList.add('active')
        check[1].classList.add('active')
    }
})

let imgUploader = document.querySelector('.openUploader');
document.querySelectorAll('.upload-btn').forEach( uploadButton => {
    uploadButton.addEventListener('click', () => {  
        imgUploader.click();
    })
})


