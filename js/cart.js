
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
let accordionBody = document.querySelectorAll('.sidebar__accordion-item');

let formInput = 1;
let check = document.querySelectorAll('.check');

accordionItem[0].addEventListener('click', () => {
    if(accordionBody[0].classList.contains('active')) {
        accordionBody[0].classList.remove('active')
        check[0].classList.add('active')
    } else {
        check[0].classList.remove('active')
        accordionBody[0].classList.add('active')  
        accordionBody[1].classList.remove('active')
        accordionBody[2].classList.remove('active')
    }
})

accordionItem[1].addEventListener('click', () => {
    if(accordionBody[1].classList.contains('active')) {
        accordionBody[1].classList.remove('active')
    } else {
        check[0].classList.add('active')
        check[1].classList.remove('active')
        accordionBody[0].classList.remove('active')
        accordionBody[1].classList.add('active')
        accordionBody[2].classList.remove('active')
    }
}, false)

accordionItem[2].addEventListener('click', () => {
    if(accordionBody[2].classList.contains('active')) {
        accordionBody[2].classList.remove('active');
       
    } else if(accordionItem[0].classList.contains('active')){
        accordionBody[1].classList.add('active')
        accordionBody[0].classList.remove('active')
    } else if (formInput == '') {
        alert('Заполните форму')
    } else {
        accordionBody[0].classList.remove('active')
        accordionBody[1].classList.remove('active')
        accordionBody[2].classList.add('active')
        check[1].classList.add('active')
    }
})

let imgUploader = document.querySelector('.openUploader');
document.querySelectorAll('.upload-btn').forEach( uploadButton => {
    uploadButton.addEventListener('click', () => {  
        imgUploader.click();
    })
})

// -------------- chosing cards and all listeners ---------------

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener( 'click', () => {
        card.classList.toggle('active');
        clickCard()
       
    })
})

//------------------------ SIZE-------------------------

function changeSize() {
    document.querySelectorAll('.card.active').forEach(activecard => {
        let currentSize = document.querySelector('.size__input');
        activecard.querySelector('.size').innerHTML = `${currentSize.value}`;
    })
}

document.querySelector('.size__input').addEventListener('change', changeSize);

// ---------------------------TYPE------------------

function changeType() {
    document.querySelectorAll('.card.active').forEach(activecard => {
        let currentSize = document.querySelector('.type__input');
        activecard.querySelector('.type').innerHTML = `${currentSize.value}`;
    })
}

document.querySelector('.type__input').addEventListener('change', changeType);

// -------------------------MATHERIAL-------------

function changeMath() {
    document.querySelectorAll('.card.active').forEach(activecard => {
        let currentSize = document.querySelector('.matherial__input');
        activecard.querySelector('.matherial').innerHTML = `${currentSize.value}`;
    })
}

document.querySelector('.matherial__input').addEventListener('change', changeMath), false;

// ---------------------COUNT-----------------


function plusCount() {
    document.querySelectorAll('.card.active').forEach(activecard => {
        let cardVal = activecard.querySelector('.count_num'); 
        cardVal.value++;
        cardVal.innerHTML = `${cardVal}`
        console.log(cardVal.value);

        cartCount()
        totalPrice()
    })
}

function minusCount() {
    document.querySelectorAll('.card.active').forEach(activecard => {
        let cardVal = activecard.querySelector('.count_num'); 
        cardVal.value--;
        cardVal.innerHTML = `${cardVal}`
        console.log(cardVal.value);

        cartCount()
        totalPrice()
    })
}

document.querySelector('.plus').addEventListener('click', plusCount);
document.querySelector('.minus').addEventListener('click', minusCount);

// --------------------- SIDEBAR CART AND PRICE COUNTER --------------------------
let result = 0;

function cartCount() {
    let result = 0;
    document.querySelectorAll('.count_num').forEach( el => {
            result = result + parseInt(el.value);
            document.querySelector('.allcount').innerHTML = `${result}`;
    });
}

cartCount();



function totalPrice(){
    let price = 0;
    
    document.querySelectorAll('.card').forEach( el => {
        let totalSize = el.querySelector('.size');
        totalSize = totalSize.dataset.price;

        let totalCount = el.querySelector('.count_num');
        totalCount = totalCount.value;

        price = price + (parseInt( totalSize) * parseInt(totalCount));
        console.log(price);
        document.querySelector('.totalprice').innerHTML = `${price}`;
    });
}

totalPrice()











function clickCard() {

    let cards = document.querySelectorAll('.card.active')

    console.log(cards);
    document.querySelector('.all-cards').innerHTML = `Обрано ${cards.length}`

    if(cards.length == ''){
        document.querySelector('.editor').classList.remove('active');
    } else {
        document.querySelector('.editor').classList.add('active');
    }
}

// ------------Uploading and create new cards --------------------

let img = document.querySelector('.openUploader').value;

// function addCard() {
//     document.querySelector('.cards').innerHTML = `<div class="card">${img[0]}<div>`;
// } 

let file1 = document.querySelector('.openUploader');

document.querySelector(".openUploader").addEventListener("change", () => {
    console.log(file1.file[0]);
    let result = file1.file[0];
    
    file1.addEventListener("load", () => {
        createCard(result);
    }, false);
});


let newDiv = document.createElement("div");

function createCard(img) {
 
    newDiv.setAttribute("class", "card");
    newDiv.innerHTML = "<h1>Привет!</h1>";
    document.querySelectorAll(".card").style.backgroundImage = "url(" + img + ")";
    console.log('1');
    // myDiv.innerHTML = `${newDiv}`;
    let myDiv = document.querySelector('.cards');
    myDiv.parentNode.insertBefore(newDiv, myDiv.nextSibling); 

    // document.body.insertBefore(newDiv ,myDiv);
}
