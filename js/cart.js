// ------------Uploading and create new cards ----------------
let imgcontainer = document.querySelector('.cards');
let input = document.querySelector('.openUploader');
let imagesArray = [];

function addCard() {
    const reader = new FileReader()
        let files = document.querySelector('.openUploader').files;
            reader.addEventListener("loadend", (e) => {
                document.querySelector('.firstscreen').style.display = 'none';
                    for (var i = 0; i < files.length; i++) {
                        imagesArray.push(files[i]); 
                        CREATE(URL.createObjectURL(files[i]), files[i].name);
                    } 
                    totalPrice()
                    cartCount()
            }, false);
        reader.readAsDataURL(files[0])
}

function CREATE(img,name) {
    let newDiv = document.createElement("div");
    newDiv.setAttribute('class', 'card')
    newDiv.setAttribute('data-filename',`${name}`)
    newDiv.style.background = `url(${img})`;
    newDiv.style.backgroundSize = 'cover';
     // CREATE PRICE
    let pricespan = document.createElement("span");
    pricespan.setAttribute('data-price','10')
    pricespan.setAttribute('class','card__options size')
    pricespan.innerHTML = '10x10';
    // CREATE TYPE
    let typespan = document.createElement("span");
    typespan.setAttribute('class','card__options type');
    typespan.innerHTML = 'Без полів';
    // CREATE MATHERIAL
    let mathspan = document.createElement("span");
    mathspan.setAttribute('class','card__options matherial');
    mathspan.innerHTML = 'Глянець';
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
    // ADD CARD SETTINGS
    newDiv.appendChild(pricespan);
    newDiv.appendChild(typespan);
    newDiv.appendChild(mathspan);
    newDiv.appendChild(countspan);

    imgcontainer.appendChild(newDiv);
}

input.addEventListener('change', addCard)


// DELETE CARD
document.querySelector('.trash').addEventListener('click',() =>{
    document.querySelectorAll('.card.active').forEach(activecard => {
        const filename = activecard.getAttribute('data-filename');
        removeFileFromImagesArray(filename);
        activecard.remove();
        totalPrice()
        cartCount()
        clickCard()
    })
});

function removeFileFromImagesArray(filename) {
    const index = imagesArray.findIndex(file => file.name === filename);
    if (index !== -1) {
      imagesArray.splice(index, 1);
    }
    console.log(imagesArray);
}

// COPY CARD 
document.querySelector('.dublicate').addEventListener('click',() =>{
    document.querySelectorAll('.card.active').forEach(activecard => {
        let copyElems = activecard.cloneNode(true);
        imgcontainer.appendChild(copyElems);
        totalPrice()
        cartCount()
        clickCard()
    })
});

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


const accordionTitles = document.querySelectorAll('.sidebar__accordion-title');

accordionTitles.forEach(title => {
  title.addEventListener('click', () => {
    const item = title.parentElement;
    const content = item.querySelector('.sidebar__accordion-contant');
    if (item.classList.contains('active')) {
      item.classList.remove('active');
      content.style.maxHeight = null;
    } else {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

const submitButton = document.querySelector('.pay');
submitButton.addEventListener('click', (event) => {
  event.preventDefault();

  const nameInput = document.querySelector('.name');
  const surnameInput = document.querySelector('.surname');
  const phoneInput = document.querySelector('.phone');

  if (!nameInput.value || !surnameInput.value || !phoneInput.value) {
    alert('Пожалуйста, заполните все обязательные поля');
  } else {
    
        SAVE()
    }
});

let imgUploader = document.querySelector('.openUploader');
document.querySelectorAll('.upload-btn').forEach( uploadButton => {
    uploadButton.addEventListener('click', () => {  
        imgUploader.click();
    })
})


function PAY(sum) {
    fetch('https://api.monobank.ua/api/merchant/invoice/create', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': 'u-Lz3ZxhSN0pc_tIxt_EfLjocKZLVnwk-9z5F-bampEE'
        },
        body: JSON.stringify({
          amount: sum,
          ccy: 980,
          redirectUrl: 'https://example.com/your/website/result/page',
          webHookUrl: 'https://example.com/mono/acquiring/webhook/maybesomegibberishuniquestringbutnotnecessarily',
          validity: 3600,
          paymentType: 'debit',
        })
      })
      .then(response => response.json())
      .then(data => {
            if (data.hasOwnProperty('pageUrl')) {
                window.location.replace(data.pageUrl);
            }
      })
      .catch(error => console.error(error));   

}


// -------------- choosing cards and all listeners ---------------

    document.querySelector('.cards').addEventListener( 'click', e => {
        if ( e.target.classList.contains('card') || e.target.closest('.card') ) {
            (e.target.closest('.card') || e.target).classList.toggle('active')
            clickCard()
        }
    })

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
        // console.log(cardVal.value);

        if (cardVal.value < 1) {
            cardVal.value = 1;
            // console.log(cardVal.value);
        }

        cartCount()
        totalPrice()
    })
}

function minusCount() {
    document.querySelectorAll('.card.active').forEach(activecard => {
        let cardVal = activecard.querySelector('.count_num'); 
        cardVal.value--;
        cardVal.innerHTML = `${cardVal}`
        // console.log(cardVal.value);

        if (cardVal.value < 1) {
            cardVal.value = 1;
            // console.log(cardVal.value);
        }

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
        document.querySelectorAll('.totalprice').forEach(price_el =>{
            price_el.innerHTML = `${sum}`;
        });

    });
}

totalPrice()

function clickCard() {
    let cards = document.querySelectorAll('.card.active')
    document.querySelector('.all-cards').innerHTML = `Обрано ${cards.length}`
    if(cards.length == ''){
        document.querySelector('.editor').classList.remove('active');
    } else {
        document.querySelector('.editor').classList.add('active');
    }
}




function sendForm() {
        fetch('https://fotka.salesdrive.me/handler/', {
            method: 'POST',
            mode: 'no-cors',
            body: {
                form: 'DKooe-JJggzbJC-sfXadyfYJdFk3r9eyulTnIE7yeI8JyJf7dHeEJjToaemPWwmiv2sdJp',
                getResultData: '1',
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
    // .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

}


const nameInput = document.querySelector('.name');
const surnameInput = document.querySelector('.surname');
const phoneInput = document.querySelector('.phone');
const emailInput = document.querySelector('.email');

const payButton = document.querySelector('.pay');

function togglePayButton() {
  if (nameInput.value && surnameInput.value && phoneInput.value && emailInput.value) {
    payButton.removeAttribute('disabled');
  } else {
    payButton.setAttribute('disabled', 'disabled');
  }
}

nameInput.addEventListener('input', togglePayButton);
surnameInput.addEventListener('input', togglePayButton);
phoneInput.addEventListener('input', togglePayButton);
emailInput.addEventListener('input', togglePayButton);

togglePayButton();

document.getElementById('loader-wrapper2').classList.add('hidden');

function SAVE() {
    document.getElementById('loader-wrapper').classList.remove('hidden');
    document.getElementById('loader-wrapper2').classList.add('visible');
    
    const formData = new FormData();
    const photos = imagesArray;
  
    const nameInput = document.querySelector('.name');
    const surnameInput = document.querySelector('.surname');
    const phoneInput = document.querySelector('.phone');
    const emailInput = document.querySelector('.email');
  
    const name = nameInput.value;
    const surname = surnameInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value;
  
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('phone', phone);
    formData.append('email', email);
  
    const newPhotos = photos.map(photo => {
        const card = document.querySelector(`[data-filename="${photo.name}"]`);
        if (card) {
          const price = card.querySelector('.size').dataset.price;
          const newName = `${transliterate(card.innerText.trim().replace(/[\s\n]+/g, '_'))}_${price}_${transliterate(photo.name).replace(/\s+/g, '_')}`;
          photo.name = newName;
          console.log(newName);
          return new File([photo], newName);
        } else {
          return photo;
        }
    });
  
    for (let i = 0; i < newPhotos.length; i++) {
      formData.append('photos', newPhotos[i]);
    }
  
    console.log(formData);

      let amount = 0;
      document.querySelectorAll('.card').forEach( el => {
          let totalSize = el.querySelector('.size').dataset.price;
          let totalCount = el.querySelector('.count_num');
          totalCount = totalCount.value;
          amount = amount + (parseInt( totalSize) * parseInt(totalCount)) * 100;
      });
      
  
    fetch('http://127.0.0.1:1228/upload', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
    })
    .then(response => {
        console.log('Upload successful', response);
        document.getElementById('loader-wrapper2').classList.remove('visible');
        document.getElementById('loader-wrapper2').classList.add('hidden');
        PAY(amount);
        
    })
    .catch(error => {
        console.error('Error uploading photos:', error);
    });

           
    
   

    
  }