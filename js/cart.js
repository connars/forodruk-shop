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
