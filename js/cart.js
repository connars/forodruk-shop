// ------------Uploading and create new cards ----------------
let imgcontainer = document.querySelector(".cards");
let input = document.querySelector(".openUploader");
let imagesArray = [];

function addCard() {
  const reader = new FileReader();
  let files = document.querySelector(".openUploader").files;
  reader.addEventListener(
    "loadend",
    (e) => {
      document.querySelector(".firstscreen").style.display = "none";
      for (var i = 0; i < files.length; i++) {
        imagesArray.push(files[i]);
        const fileExtension = files[i].name.split(".").pop().toLowerCase();
        const imageUrl = fileExtension === "heic" ? "heic.png" : URL.createObjectURL(files[i]);
        CREATE(imageUrl, files[i].name);
      }
      checkPhotoCount();
      totalPrice();
      cartCount();
    },
    false
  );
  reader.readAsDataURL(files[0]);
}

function checkPhotoCount() {
  if (imagesArray.length > 500) {
    alert("Кількість фотографій перевищує 500!");
    imagesArray.splice(500);
    return;
  }
  
  console.log(imagesArray.length);
}

function CREATE(img, name) {
  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", "card");
  newDiv.setAttribute("data-filename", `${name}`);
  newDiv.style.background = `url(${img})`;
  newDiv.style.backgroundSize = "cover";
  // CREATE PRICE
  let pricespan = document.createElement("span");
  pricespan.setAttribute("data-price", "4");
  pricespan.setAttribute("class", "card__options size");
  pricespan.innerHTML = "9x13";
  // CREATE TYPE
  let typespan = document.createElement("span");
  typespan.setAttribute("class", "card__options type");
  typespan.setAttribute("data-type", "1");
  typespan.innerHTML = "З полями";
  // CREATE MATHERIAL
  let mathspan = document.createElement("span");
  mathspan.setAttribute("class", "card__options matherial");
  mathspan.innerHTML = "Глянець";
  // CREATE COUNT
  let countspan = document.createElement("span");
  let countinput = document.createElement("input");
  // let text = document.createElement("span");
  countspan.setAttribute("class", "card__options countc");
  countinput.setAttribute("type", "number");
  countinput.setAttribute("class", "count_num");
  countinput.setAttribute("value", "1");
  // text.innerHTML = "шт";

  countspan.appendChild(countinput);
  // countspan.appendChild(text);
  // ADD CARD SETTINGS
  newDiv.appendChild(pricespan);
  newDiv.appendChild(typespan);
  newDiv.appendChild(mathspan);
  newDiv.appendChild(countspan);

  imgcontainer.appendChild(newDiv);
}

input.addEventListener("change", addCard);

// ВЫБРАТЬ ВСЕ ФОТО
document.querySelector('.check-all').addEventListener('click', () => {
  document.querySelectorAll('.card').forEach(card => {
    if ( card.classList.contains('active')) {
      card.classList.remove('active');
    } else {
      card.classList.add('active');
    }
    clickCard();
  })
})


// DELETE CARD
document.querySelector(".trash").addEventListener("click", () => {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    const filename = activecard.getAttribute("data-filename");
    removeFileFromImagesArray(filename);
    activecard.remove();
    totalPrice();
    cartCount();
    clickCard();
    checkPhotoCount()
    console.log(imagesArray);
  });
});
function removeFileFromImagesArray(filename) {
  const index = imagesArray.findIndex((file) => file.name === filename);
  if (index !== -1) {
    imagesArray.splice(index, 1);
  }
  console.log(imagesArray);
}
// COPY CARD
document.querySelector(".dublicate").addEventListener("click", () => {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    // let copyElems = activecard.cloneNode(true);
    // imgcontainer.appendChild(copyElems);
    totalPrice();
    cartCount();
    clickCard();
    checkPhotoCount()
    console.log(imagesArray);
    copyFileToImagesArray()
  });
});

function copyFileToImagesArray() {
  const activecard = document.querySelector(".card.active");
  const copyElems = activecard.cloneNode(true);
  const filename = copyElems.getAttribute("data-filename");
  const newFilename = imagesArray.length +  "_(копия фото)"  + filename;
  copyElems.setAttribute("data-filename", newFilename);
  imagesArray.push({ name: newFilename });
  imgcontainer.appendChild(copyElems);
  totalPrice();
  cartCount();
  clickCard();
  checkPhotoCount();
  console.log(imagesArray);
}


// ------------ open sidebar --------------------
let cart = document.querySelector(".upload__main-sidebar");

document.querySelector(".footer-button").addEventListener("click", () => {
  if (cart.classList.contains("active")) {
    cart.classList.remove("active");
  } else {
    cart.classList.add("active");
  }
});

document
  .querySelector(".upload__sidebar-exit")
  .addEventListener("click", () => {
    if (cart.classList.contains("active")) {
      cart.classList.remove("active");
    } else {
      cart.classList.add("active");
    }
  });

const accordionTitles = document.querySelectorAll(".sidebar__accordion-title");

accordionTitles.forEach((title) => {
  title.addEventListener("click", () => {
    const item = title.parentElement;
    const content = item.querySelector(".sidebar__accordion-contant");

    // Снимаем активное состояние со всех элементов, кроме того, на который был клик
    accordionTitles.forEach((otherTitle) => {
      const otherItem = otherTitle.parentElement;
      if (otherItem !== item) {
        otherItem.classList.remove("active");
        otherItem.querySelector(".sidebar__accordion-contant").style.maxHeight =
          null;
      }
    });

    // Добавляем/снимаем активное состояние выбранному элементу
    if (item.classList.contains("active")) {
      item.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      item.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

const submitButton = document.querySelector(".pay");
submitButton.addEventListener("click", (event) => {
  event.preventDefault();

  const nameInput = document.querySelector(".name");
  const surnameInput = document.querySelector(".surname");
  const phoneInput = document.querySelector(".phone");
  const cityInput = document.querySelector(".surname");
  const adressInput = document.querySelector("#warehouses");

  if (
    !nameInput.value ||
    !surnameInput.value ||
    !phoneInput.value ||
    !cityInput.value ||
    !adressInput.value
  ) {
    alert("Пожалуйста, заполните все обязательные поля");
  } else {
    // addCrm();
    SAVE();
  }
});

let imgUploader = document.querySelector(".openUploader");
document.querySelectorAll(".upload-btn").forEach((uploadButton) => {
  uploadButton.addEventListener("click", () => {
    imgUploader.click();
  });
});

function PAY(sum) {

    sum.toFixed(2)
    const phone = document.querySelector(".phone").value;

    fetch("https://api.monobank.ua/api/merchant/invoice/create", {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "X-Token": "mFqcOT0IpvEpR77RxMRdHnw",
      },
      body: JSON.stringify({
        // amount: sum,
        amount: sum,
        ccy: 980,
        redirectUrl: "http://fotka.in.ua/thanks.html",
        webHookUrl: `http://api.fotka.in.ua/webhook?phone=${phone}`,
        validity: 3600,
        paymentType: "debit",
      }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.hasOwnProperty("pageUrl")) {
            window.open(data.pageUrl, "_self");
        }   
      // const invoiceId = data.invoiceId;
   
      // let url = `http://localhost:3002/get-info?invoiceId=${invoiceId}&number=${phoneInput}`

      // fetch(url)
      // .then(response => {
      //   if (response.ok) {

  

      //     return response.json();
      //   } else {
      //     throw new Error('Ошибка при запросе к серверу');
      //   }
      // })
      // .then(data => {
      //   console.log(data); // обработка полученных данных
      // })
      // .catch(error => console.error(error));
    })
    .catch((error) => console.error(error));

    console.log(phoneInput);
}

function test() {

}

// -------------- choosing cards and all listeners ---------------

document.querySelector(".cards").addEventListener("click", (e) => {
  if (e.target.classList.contains("card") || e.target.closest(".card")) {
    (e.target.closest(".card") || e.target).classList.toggle("active");
    clickCard();
  }
});

//------------------------ SIZE-------------------------

function changeSize() {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    let currentSize = document.querySelector(".size__input");

    const selectedOption = currentSize.options[currentSize.selectedIndex];
    const selectedOptionPrice = selectedOption.getAttribute("data-choseprice");

    console.log(currentSize.value);
    activecard.querySelector(".size").innerHTML = `${currentSize.value}`;
    activecard.querySelector(".size").dataset.price = selectedOptionPrice;
    console.log(selectedOptionPrice);
    totalPrice();
  });
}

document.querySelector(".size__input").addEventListener("change", changeSize);

// ---------------------------TYPE------------------

function changeType() {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    let currentSize = document.querySelector(".type__input");
    if (currentSize.value === "Без полів") {
      activecard.classList.add('type-one')
      activecard.classList.remove('type-two')
      console.log(1);
    } else if (currentSize.value === "З полями") {
      // activecard.style.backgroundSize = "contain !important";
      activecard.classList.add('type-two')
      activecard.classList.remove('type-one')
      console.log(2);
    }

    activecard.querySelector(".type").innerHTML = `${currentSize.value}`;
  });
}

document.querySelector(".type__input").addEventListener("change", changeType);

// -------------------------MATHERIAL-------------

function changeMath() {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    let currentSize = document.querySelector(".matherial__input");
    activecard.querySelector(".matherial").innerHTML = `${currentSize.value}`;
  });
}

document
  .querySelector(".matherial__input")
  .addEventListener("change", changeMath),
  false;

// ---------------------COUNT-----------------

function plusCount() {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    let cardVal = activecard.querySelector(".count_num");
    cardVal = cardVal.value++;
    cardVal.innerHTML = `${cardVal}`;
    // console.log(cardVal.value);

    if (cardVal.value < 1) {
      cardVal.value = 1;
      // console.log(cardVal.value);
    }
    cartCount();
    totalPrice();
  });
}

function minusCount() {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    let cardVal = activecard.querySelector(".count_num");
    cardVal.value--;
    cardVal.innerHTML = `${cardVal}`;
    // console.log(cardVal.value);
    

    if (cardVal.value < 1) {
      cardVal.value = 1;
      // console.log(cardVal.value);
    }

    cartCount();
    totalPrice();
  });
}

document.querySelector(".plus").addEventListener("click", plusCount);
document.querySelector(".minus").addEventListener("click", minusCount);

// --------------------- SIDEBAR CART AND PRICE COUNTER --------------------------
let result = 0;

function cartCount() {
  let result = 0;
  document.querySelectorAll(".count_num").forEach((el) => {
    result = result + parseInt(el.value);
    document.querySelectorAll(".allcount").forEach((count_el) => {
      count_el.innerHTML = `${result}`;
    });
  });
}

cartCount();

let globalPrice = 0;

function totalPrice() {
  let sum = 0;
  renderTable()
  document.querySelectorAll(".card").forEach((el) => {
    let totalSize = el.querySelector(".size").dataset.price;
    let totalCount = el.querySelector(".count_num");
    totalCount = totalCount.value;
    sum = sum + parseFloat(totalSize) * parseInt(totalCount);

    globalPrice = sum;
    document.querySelectorAll(".totalprice").forEach((price_el) => {
      price_el.innerHTML = `${sum.toFixed(2)}`;
    });
  });
}

totalPrice();


// =================================== ПОДИТОГ КОРЗИНЫ =====================
var orderInfo = 'none';

function countSizes() {
  const sizes = document.querySelectorAll('.card .size');

  const counts = [];
  const info = [];

  sizes.forEach(size => {
    const text = size.textContent.trim();
    const count = size.closest('.card').querySelector('.count_num').value;
    const price = size.getAttribute('data-price');
    const match = counts.find(c => c.size === text);

    if (match) {
      match.count += Number(count);
    } else {
      counts.push({ size: text, count: Number(count), price });
    }

    // info.push(`${text} - ${counts.find(c => c.size === text)?.count}шт`);
  });
  
  info.push(...counts.map(({ size, count }) => `${size} - ${count}шт`));

  if(info !== '') {
    orderInfo = info.join(', ');
    console.log(orderInfo);
  }
  

  return counts;
}


function renderTable() {
  const counts = countSizes();
  const table = document.querySelector('#sizes-table');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  
  counts.forEach(count => {
    const row = document.createElement('tr');
    const sizeCell = document.createElement('td');
    sizeCell.textContent = count.size;
    sizeCell.setAttribute('data-price', count.price);
    const countCell = document.createElement('td');
    countCell.textContent = count.count + ' шт';
    const priceCell = document.createElement('td');
    priceCell.textContent = (count.count * parseFloat(count.price)).toFixed(2) + ' грн';
    row.appendChild(sizeCell);
    row.appendChild(countCell);
    row.appendChild(priceCell);
    tbody.appendChild(row);
  });
}

renderTable();



function getOrderInfo() {
  console.log(orderInfo);
}

// ========================================================================

function clickCard() {
  let cards = document.querySelectorAll(".card.active");
  document.querySelector(".all-cards").innerHTML = `Обрано ${cards.length}`;
  if (cards.length == "") {
    document.querySelector(".editor").classList.remove("active");
  } else {
    document.querySelector(".editor").classList.add("active");
  }
}

const nameInput = document.querySelector(".name");
const surnameInput = document.querySelector(".surname");
const phoneInput = document.querySelector(".phone");
const emailInput = document.querySelector(".email");

const payButton = document.querySelector(".pay");

function togglePayButton() {
  if (
    nameInput.value &&
    surnameInput.value &&
    phoneInput.value 
  ) {
    payButton.removeAttribute("disabled");
  } else {
    payButton.setAttribute("disabled", "disabled");
  }
}

nameInput.addEventListener("input", togglePayButton);
surnameInput.addEventListener("input", togglePayButton);
phoneInput.addEventListener("input", togglePayButton);
emailInput.addEventListener("input", togglePayButton);

togglePayButton();

document.getElementById("loader-wrapper2").classList.add("hidden");

// ===================== Отправка данных на сервер ============================

function SAVE() {
  document.getElementById("loader-wrapper2").classList.remove("hidden");
  document.getElementById("loader-wrapper2").classList.add("visible");
  const formData = new FormData();
  const photos = imagesArray;
  const nameInput = document.querySelector(".name");
  const surnameInput = document.querySelector(".surname");
  const phoneInput = document.querySelector(".phone");
  const emailInput = document.querySelector(".email");
  const name = nameInput.value;
  const surname = surnameInput.value;
  const phone = phoneInput.value;
  const email = emailInput.value;
  formData.append("name", name);
  formData.append("surname", surname);
  formData.append("phone", phone);
  formData.append("email", email);

  const newPhotos = photos.map((photo) => {
    const card = document.querySelector(`[data-filename="${photo.name}"]`);
    if (card) {
      const count = card.querySelector(".count_num").value;
      const newName = `${transliterate(
        card.innerText.trim().replace(/[\s\n]+/g, "_")
      )}_Kolichestvo(${count})_${transliterate(photo.name).replace(/\s+/g, "_")}`;
      photo.name = newName;
      console.log(newName);
      return new File([photo], newName);
    } else {
      return photo;
    }
  });
  for (let i = 0; i < newPhotos.length; i++) {
    formData.append("photos", newPhotos[i]);
  }
  console.log(formData);
  let amount = 0;
  document.querySelectorAll(".card").forEach((el) => {
    let totalSize = el.querySelector(".size").dataset.price;
    let totalCount = el.querySelector(".count_num");

    totalCount = totalCount.value;
    amount = amount + parseInt(totalSize) * parseInt(totalCount) * 100;
  });
  fetch("http://api.fotka.in.ua/upload", {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
    .then((response) => {
      console.log("Upload successful", response);
      addCrm()
      function test() {
        console.log(amount);
      }

      PAY(amount);
      
      document.getElementById("loader-wrapper2").classList.remove("visible");
      document.getElementById("loader-wrapper2").classList.add("hidden");
    })
    .catch((error) => {
      console.error("Error uploading photos:", error);
    });
}


// ===================== Получение отделений новой почты ============================

const apiKey = '65fa689752b60a1762ab7298895c6930';
const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

const cityInput = document.getElementById('city');
const warehousesSelect = document.getElementById('warehouses');

const getCities = async (search) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        apiKey: apiKey,
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
          FindByString: search,
        },
      }),
    });

    const data = await response.json();

    if (data.success) {
      const cities = data.data.map((city) => city.Description);
      updateCitiesList(cities);
    } else {
      console.log('Ошибка получения данных', data);
    }
  } catch (error) {
    console.log('Ошибка запроса', error);
  }
};

const updateCitiesList = (cities) => {
  const datalist = document.getElementById('cities');
  datalist.innerHTML = '';
  cities.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    datalist.appendChild(option);
  });
};

cityInput.addEventListener('input', () => {
  getCities(cityInput.value);
});


cityInput.addEventListener('change', (event) => {
  const selectedCity = event.target.value;
  if (selectedCity) {
    getWarehouses(selectedCity);
  }
});

let adressNp = '';


const getWarehouses = async (city) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        apiKey: apiKey,
        modelName: 'AddressGeneral',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityName: city,
        },
      }),
    });

    const data = await response.json();

    if (data.success) {
      warehousesSelect.innerHTML = '';
      data.data.forEach((warehouse) => {
        const option = document.createElement('option');
        option.text = `${warehouse.Description}`;
        option.value = warehouse.Ref;
        warehousesSelect.appendChild(option);
        adressNp = warehouse.Ref;
      });
    } else {
      console.log('Ошибка получения данных', data);
    }
  } catch (error) {
    console.log('Ошибка запроса', error);
  }

  console.log(adressNp);
};

cityInput.addEventListener('input', () => {
  getWarehouses(cityInput.value);
});

// ===================== Отправка данных в срм ============================

function addCrm() {
  const nameInput = document.querySelector(".name");
  const surnameInput = document.querySelector(".surname");
  const phoneInput = document.querySelector(".phone");
  const emailInput = document.querySelector(".email");

  const name2 = nameInput.value;
  const surname2 = surnameInput.value;
  const phone2 = phoneInput.value.replace(/[\s-+()]/g, '');
  console.log(phone2);
  const mail2 = emailInput.value;

  const data = new FormData();
  data.append("getResultData", "0");
  data.append("form", "DKooe-JJggzbJC-sfXadyfYJdFk3r9eyulTnIE7yeI8JyJf7dHeEJjToaemPWwmiv2sdJp");
  data.append("fName",  name2);
  data.append("lName", surname2);
  data.append("phone", phone2);
  data.append("email", mail2);
  // data.append("con_comment", orderInfo);
  data.append("products[0][id]", "1");
  data.append("products[0][costPerItem]", globalPrice);
  data.append("products[0][amount]", "1");
  data.append("products[0][description]", orderInfo);
  data.append("payment_status", "paid");
  data.append("shipping_method", "id_9");
  // data.append("shipping_address", "ул. Пушкина, д.10");
  data.append("novaposhta[ServiceType]", "WarehouseWarehouse");
  data.append("novaposhta[payer]", "recipient");
  // data.append("novaposhta[area]", "Киевская");
  // data.append("novaposhta[region]", "Киевский");
  // data.append("novaposhta[city]", "Киев");
  data.append("novaposhta[cityNameFormat]", "short");
  data.append("novaposhta[WarehouseNumber]", adressNp);

  const headers = new Headers();
  headers.append("Form-Api-Key", "DKooe-JJggzbJC-sfXadyfYJdFk3r9eyulTnIE7yeI8JyJf7dHeEJjToaemPWwmiv2sdJp");

  fetch("https://fotka.salesdrive.me/handler/", {
    method: "POST",
    mode: 'no-cors',
    headers: headers,
    body: data
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
}

const nameMask = new IMask(nameInput, {
  mask: /^[А-ЯЁІЇҐа-яёіїґ']+$/,
  prepare: function(value, masked) {
    return value;
  }
});

const surnameMask = new IMask(surnameInput, {
  mask: /^[А-ЯЁІЇҐа-яёіїґ']+$/,
  prepare: function(value, masked) {
    return value;
  }
});

const phoneMask = new IMask(phoneInput, {
  mask: "+{38}(000)000-00-00"
});

const checkbox = document.getElementById('c1');
const button = document.querySelector('.upload-btn');

function toggleButton() {
  if (checkbox.checked) {
    button.classList.remove('disabled');
    button.removeAttribute('disabled');
  } else {
    button.classList.add('disabled');
    button.setAttribute('disabled', 'disabled');
  }
}

checkbox.addEventListener('change', toggleButton);



var dropzone = document.getElementById('dropzone');

function handleDragOver() {
  addCard()
}

dropzone.addEventListener('dragover', handleDragOver, false);
dropzone.addEventListener('drop', handleDragOver, false);

const apiKeyS = process.env.API_KEY;

console.log(apiKeyS);