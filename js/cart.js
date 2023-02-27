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
        CREATE(URL.createObjectURL(files[i]), files[i].name);
      }
      totalPrice();
      cartCount();
    },
    false
  );
  reader.readAsDataURL(files[0]);
}

function CREATE(img, name) {
  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", "card");
  newDiv.setAttribute("data-filename", `${name}`);
  newDiv.style.background = `url(${img})`;
  newDiv.style.backgroundSize = "cover";
  // CREATE PRICE
  let pricespan = document.createElement("span");
  pricespan.setAttribute("data-price", "10");
  pricespan.setAttribute("class", "card__options size");
  pricespan.innerHTML = "10x10";
  // CREATE TYPE
  let typespan = document.createElement("span");
  typespan.setAttribute("class", "card__options type");
  typespan.innerHTML = "Без полів";
  // CREATE MATHERIAL
  let mathspan = document.createElement("span");
  mathspan.setAttribute("class", "card__options matherial");
  mathspan.innerHTML = "Глянець";
  // CREATE COUNT
  let countspan = document.createElement("span");
  let countinput = document.createElement("input");
  let text = document.createElement("span");
  countspan.setAttribute("class", "card__options countc");
  countinput.setAttribute("type", "number");
  countinput.setAttribute("class", "count_num");
  countinput.setAttribute("value", "1");
  text.innerHTML = "шт";

  countspan.appendChild(countinput);
  countspan.appendChild(text);
  // ADD CARD SETTINGS
  newDiv.appendChild(pricespan);
  newDiv.appendChild(typespan);
  newDiv.appendChild(mathspan);
  newDiv.appendChild(countspan);

  imgcontainer.appendChild(newDiv);
}

input.addEventListener("change", addCard);

// DELETE CARD
document.querySelector(".trash").addEventListener("click", () => {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    const filename = activecard.getAttribute("data-filename");
    removeFileFromImagesArray(filename);
    activecard.remove();
    totalPrice();
    cartCount();
    clickCard();
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
    let copyElems = activecard.cloneNode(true);
    imgcontainer.appendChild(copyElems);
    totalPrice();
    cartCount();
    clickCard();
  });
});

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
  const adressInput = document.querySelector(".phone");

  if (
    !nameInput.value ||
    !surnameInput.value ||
    !phoneInput.value ||
    !cityInput.value ||
    !adressInput.value
  ) {
    alert("Пожалуйста, заполните все обязательные поля");
  } else {
    addCrm();
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
  fetch("https://api.monobank.ua/api/merchant/invoice/create", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "X-Token": "mFqcOT0IpvEpR77RxMRdHnw",
    },
    body: JSON.stringify({
      amount: sum,
      ccy: 980,
      redirectUrl: "https://api.fotka.in.ua/get-info",
      webHookUrl:
        "https://example.com/mono/acquiring/webhook/maybesomegibberishuniquestringbutnotnecessarily",
      validity: 3600,
      paymentType: "debit",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.hasOwnProperty("pageUrl")) {
      }
    })
    .catch((error) => console.error(error));
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
    console.log(currentSize.value);
    activecard.querySelector(".size").innerHTML = `${currentSize.value}`;
    activecard.querySelector(".size").dataset.price = currentSize.value;

    totalPrice();
  });
}

document.querySelector(".size__input").addEventListener("change", changeSize);

// ---------------------------TYPE------------------

function changeType() {
  document.querySelectorAll(".card.active").forEach((activecard) => {
    let currentSize = document.querySelector(".type__input");
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
    cardVal.value++;
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

function totalPrice() {
  let sum = 0;

  document.querySelectorAll(".card").forEach((el) => {
    let totalSize = el.querySelector(".size").dataset.price;
    let totalCount = el.querySelector(".count_num");
    totalCount = totalCount.value;
    sum = sum + parseInt(totalSize) * parseInt(totalCount);
    document.querySelectorAll(".totalprice").forEach((price_el) => {
      price_el.innerHTML = `${sum}`;
    });
  });
}

totalPrice();

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
    phoneInput.value &&
    emailInput.value
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
      const price = card.querySelector(".size").dataset.price;
      const newName = `${transliterate(
        card.innerText.trim().replace(/[\s\n]+/g, "_")
      )}_${price}_${transliterate(photo.name).replace(/\s+/g, "_")}`;
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
  fetch("https://api.fotka.in.ua/upload", {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
    .then((response) => {
      console.log("Upload successful", response);
      PAY(amount);
      document.getElementById("loader-wrapper2").classList.remove("visible");
      document.getElementById("loader-wrapper2").classList.add("hidden");
    })
    .catch((error) => {
      console.error("Error uploading photos:", error);
    });
}

function getAdress() {
  const requestUrl = "https://api.novaposhta.ua/v2.0/json/";
  const apiKey = "65fa689752b60a1762ab7298895c6930";

  const requestData = {
    apiKey: apiKey,
    modelName: "Address",
    calledMethod: "searchSettlements",
    methodProperties: {
      CityName: "Київ",
    },
  };

  fetch(requestUrl, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      const addresses = data.data[0].Addresses;
      addresses.forEach((address) => {
        console.log(address.Ref);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

const apiKey = "65fa689752b60a1762ab7298895c6930";
const apiUrl = "https://api.novaposhta.ua/v2.0/json/";

const cityInput = document.getElementById("city");
const warehousesSelect = document.getElementById("warehouses");

const getWarehouses = async (city) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        apiKey: apiKey,
        modelName: "AddressGeneral",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityName: city,
        },
      }),
    });

    const data = await response.json();

    if (data.success) {
      warehousesSelect.innerHTML = "";
      data.data.forEach((warehouse) => {
        const option = document.createElement("option");
        option.text = `${warehouse.Description}`;
        option.value = warehouse.Ref;
        warehousesSelect.appendChild(option);
      });
    } else {
      console.log("Ошибка получения данных", data);
    }
  } catch (error) {
    console.log("Ошибка запроса", error);
  }
};

cityInput.addEventListener("input", () => {
  getWarehouses(cityInput.value);
});

async function addCrm() {
  const nameInput = document.querySelector(".name");
  const surnameInput = document.querySelector(".surname");
  const phoneInput = document.querySelector(".phone");
  const emailInput = document.querySelector(".email");

  const name2 = nameInput.value;
  const surname2 = surnameInput.value;
  const phone2 = phoneInput.value;
  const mail2 = emailInput.value;

  const price = 132;
  const delivery = "Нова пошта";
  const adress = "Адрес";

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    name: name2,
    surname: surname2,
    mail: mail2,
    phone: phone2,
    price: price,
    delivery: delivery,
    adress: adress,
  });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let res = await fetch("https://api.fotka.in.ua/crm-add", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  res = await res.json();
  console.log(res);
}
