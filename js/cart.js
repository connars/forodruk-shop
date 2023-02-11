// ------------Uploading and create new cards ----------------
let imgcontainer = document.querySelector('.cards');
let img = '';
let input = document.querySelector('.openUploader');

function addCard() {
    const reader = new FileReader()

    let newDiv = document.createElement("div");
    newDiv.setAttribute('class', 'card')

    let files = document.querySelector('.openUploader').files;

        reader.onload = async (event) => {
            newDiv.style.background = `url(${event.target.result})`;
            newDiv.style.backgroundSize = 'cover';
            console.log(files);

            cardInit()
            totalPrice()
            cartCount()
        }
        
    reader.readAsDataURL(files[0])
    // CREATE PRICE
    let pricespan = document.createElement("span");
    pricespan.setAttribute('data-price','10')
    pricespan.setAttribute('class','card__options size')
    pricespan.innerHTML = '10x10';
    // CREATE TYPE
    // newDiv.setAttribute('','')
    // CREATE MATHERIAL
    // newDiv.setAttribute('','')
    // CREATE COUNT
    let countspan = document.createElement("span");
    let countinput = document.createElement("input");
    let text = document.createElement("span");

    countspan.setAttribute('class','card__options countc');
    countinput.setAttribute('type','number')
    countinput.setAttribute('class','count_num')
    countinput.setAttribute('value','1')
    text.innerHTML = 'шт';
    
    countspan.appendChild(countinput);
    countspan.appendChild(text)
  
    newDiv.appendChild(pricespan);
    newDiv.appendChild(countspan);
    

    imgcontainer.appendChild(newDiv);

    
    
}

input.addEventListener('change', addCard)


// ------------ open sidebar --------------------
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
function cardInit() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener( 'click', () => {
            console.log(card)

            card.classList.toggle('active');

            clickCard()
        })
    })
}



cardInit()
//------------------------ SIZE-------------------------

function changeSize() {
    document.querySelectorAll('.card.active').forEach(activecard => {
        let currentSize = document.querySelector('.size__input');
        console.log(currentSize.value);
        activecard.querySelector('.size').innerHTML = `${currentSize.value}`;
        activecard.querySelector('.size').dataset.price = currentSize.value;

        totalPrice()
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
            document.querySelectorAll('.allcount').forEach( count_el =>{
                count_el.innerHTML = `${result}`;
            });
    });
}

cartCount();



function totalPrice(){
    let sum = 0;

    document.querySelectorAll('.card').forEach( el => {
        let totalSize = el.querySelector('.size').dataset.price;

        let totalCount = el.querySelector('.count_num');
        totalCount = totalCount.value;

        sum = sum + (parseInt( totalSize) * parseInt(totalCount));
        console.log(totalSize);
        document.querySelectorAll('.totalprice').forEach(price_el =>{
            price_el.innerHTML = `${sum}`;
        });
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

