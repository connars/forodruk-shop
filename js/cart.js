let sizes = [
    { '10x15' : 10 },
    { '20x15' : 20 },
    { '30x15' : 30 },
    { '40x15' : 40 },
    { '50x15' : 50 },
    { '60x15' : 60 },
    { '70x15' : 70 }
];



let addAddvalue = document.querySelector('.plus');
let minusAddvalue = document.querySelector('.minus');
let counter = document.querySelector('.card__count');

addAddvalue.addEventListener('click', function(){
    counter.value = parseInt(counter.value) + 1; 
}, false);

minusAddvalue.addEventListener('click', function(){
    counter.value = parseInt(counter.value) - 1; 
}, false);

let cardSize = document.querySelector('.card__sizing').value;
let cartSum = document.querySelector('.sum');
let cartSumMobile = document.querySelector('.sum-m');

function cartCacl() {


   let result = parseInt(cardSize) * parseInt(counter.value);
   cartSum.innerHTML = `${result} грн`;

   let resultMobile = parseInt(cardSize) * parseInt(counter.value);
   cartSumMobile.innerHTML = `${resultMobile} грн`;

    console.log(result);
}

setInterval(cartCacl, 400);

// document.querySelectorAll('.card__type').addEventListener('change',() => {
    
// });

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
})







async function fetchMovies() {
    let res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "apiKey": "65fa689752b60a1762ab7298895c6930",
            "modelName": "Address",
            "calledMethod": "searchSettlements",
            "methodProperties": {
                "CityName": "київ",
                "Limit": "50",
                "Page": "2",
                "MainDescription" : "50"
            }
        })   
    })

    res = await res.json()
    
    console.log(res.data);

}

fetchMovies()
