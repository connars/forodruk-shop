

let addAddvalue = document.querySelector('.plus');
let minusAddvalue = document.querySelector('.minus');
let counter = document.querySelector('.card__count');

addAddvalue.addEventListener('click', function(){
    counter.value = parseInt(counter.value) + 1; // `parseInt` converts the `value` from a string to a number
}, false);

minusAddvalue.addEventListener('click', function(){
    counter.value = parseInt(counter.value) - 1; // `parseInt` converts the `value` from a string to a number
}, false);







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
