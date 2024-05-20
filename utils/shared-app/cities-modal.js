import {
  getFromLocal,
  hideElem,
  mainURL,
  setIntoLocal,
  showElem,
} from "../shared.js";
import { renderHeaderCities } from "../../public/js/shared-app.js";
import { pageFuncsHandler } from "../../public/js/posts.js";

const selectedCitiesDeleteBtn = document.querySelector("#delete-all-cities");
const selectedCitiesContainer = document.querySelector("#city-selected");
const modalCitiesContainer = document.querySelector("#city_modal_list");

const getAllCities = async () => {
  const getReq = await fetch(`${mainURL}/location`);
  const response = await getReq.json();
  const allCities = response.data;

  return allCities;
};

const allCities = await getAllCities();
// console.log(allCities);

window.removeCityFromModal = (city) => {
  dropCity(city);
  renderAllProvinces()
  renderProvinseCities()
};

window.backToAllProvinces = () => {
  renderAllProvinces();
  renderProvinseCities();
};

const selectCity = (city) => {
  const editedCities = getFromLocal("edited-cities");
  const { id, name: title, province_id } = city;
  editedCities.push({ title, id, province_id });
  setIntoLocal("edited-cities", editedCities);
  loadSelectedCities(editedCities);
};

const dropCity = (city) => {
  const editedCities = getFromLocal("edited-cities");
  const cityIndex = editedCities.findIndex(
    (editedCity) => editedCity.id == city.id
  );
  const selectedAllCitiesCheckbox = document.querySelector(".select-all-city");

  if (cityIndex >= 0) editedCities.splice(cityIndex, 1);

  if (selectedAllCitiesCheckbox) {
    selectedAllCitiesCheckbox.querySelector("input").checked = false;
    selectedAllCitiesCheckbox.querySelector("div").classList.remove("active");
  }

  setIntoLocal("edited-cities", editedCities);
  loadSelectedCities(editedCities);
};

window.cityClickHandler = (city) => {
  const checkbox = event.target;
  const inputShape = checkbox.parentElement.querySelector("div");

  if (checkbox.checked) {
    selectCity(city);
    inputShape.classList.add("active");
  } else {
    dropCity(city);
    inputShape.classList.remove("active");
  }
};

const selectAllCities = (provinceID) => {
  const editedCities = getFromLocal("edited-cities");

  const provinceCities = allCities.cities.filter((city) => {
    // console.log(city.id);
    return (
      city.province_id == provinceID &&
      !editedCities.some((editedCity) => editedCity.id == city.id)
    );
  });

  provinceCities.forEach((city) => {
    const { id, name: title, province_id } = city;
    editedCities.push({ title, id, province_id });
  });

  setIntoLocal("edited-cities", editedCities);
  loadSelectedCities(editedCities);
};

const dropAllCities = (provinceID) => {
  const editedCities = getFromLocal("edited-cities");
  const dropedCities = editedCities.filter(
    (editedCity) => !(editedCity.province_id == provinceID)
  );

  setIntoLocal("edited-cities", dropedCities);
  loadSelectedCities(dropedCities);
};

window.allProvinceBtnHandler = (provinceID) => {
  const checkbox = event.target;
  const cityItems = document.querySelectorAll(".city-item");

  if (checkbox.checked) {
    selectAllCities(provinceID);

    cityItems.forEach((item) => {
      item.querySelector("div").classList.add("active");
      item.querySelector("input").checked = true;
    });
  } else {
    dropAllCities(provinceID);

    cityItems.forEach((item) => {
      item.querySelector("div").classList.remove("active");
      item.querySelector("input").checked = false;
    });
  }
};

const generateSelectedCityTemplate = (city) => {
  return `
  <div class="city-modal__selected-item">
    <span class="city-modal__selected-text">${city.title}</span>
    <button class="city-modal__selected-btn" onclick='removeCityFromModal(${JSON.stringify(city)})'>
      <i class="city-modal__selected-icon bi bi-x"></i>
    </button>
  </div>
  `;
};

const loadSelectedCities = (city) => {
  const modalAcceptBtn = document.querySelector('#city-modal__accept')
  const modalErrorElem = document.querySelector('#city_modal_error')
  selectedCitiesContainer.innerHTML = "";
  const localCities = getFromLocal('cities')
  const selectedCities = city || localCities
  const areCitiesSame = JSON.stringify(localCities) == JSON.stringify(selectedCities)

  if (selectedCities.length) {
    showElem(selectedCitiesDeleteBtn);
    if (!areCitiesSame){
      modalAcceptBtn.classList.replace('city-modal__accept', 'city-modal__accept--active')
    }else{
      modalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
    }
    modalErrorElem.style.display = 'none'
  } else {
    hideElem(selectedCitiesDeleteBtn);
    modalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
    modalErrorElem.style.display = 'block'
  }

  selectedCities.forEach((city) => {
    selectedCitiesContainer.insertAdjacentHTML(
      "beforeend",
      generateSelectedCityTemplate(city)
    );
  });
};

const deleteAllCitiesHandler = () => {
  selectedCitiesDeleteBtn?.addEventListener("click", () => {
    setIntoLocal("edited-cities", []);
    loadSelectedCities([]);
    renderAllProvinces();
    renderProvinseCities();
  });
};

const modalAcceptBtnHandler = () => {
  const editedCities = getFromLocal("edited-cities");
  setIntoLocal("cities", editedCities);
  pageFuncsHandler();
  renderHeaderCities();
};

const generateModalProvinceTemplate = (province) => {
  return `
  <li
    class="city-modal__cities-item province-item"
    data-province-id="${province.id}"
  >
    <span>${province.name}</span>
    <i class="city-modal__cities-icon bi bi-chevron-left"></i>
  </li>
  `;
};

const renderAllProvinces = async () => {
  modalCitiesContainer.innerHTML = "";
  modalCitiesContainer.scrollTo(0, 0)
  allCities?.provinces?.forEach((province) => {
    modalCitiesContainer.insertAdjacentHTML(
      "beforeend",
      generateModalProvinceTemplate(province)
    );
  });
};

const generateProvinceCityTemplate = (city, isSelected = false) => {
  return `
  <li class="city-modal__cities-item city-item" id="city-${city.id}">
    <span>${city.name}</span>
    <div id="check_city-${city._slug}" class="${
    isSelected ? "active" : ""
  }"></div>
    <input id="input_city-${city.id}" type="checkbox" ${
    isSelected ? 'checked="true"' : ""
  } onchange='cityClickHandler(${JSON.stringify(city)})'/>
  </li>
  `;
};

const insertProvinceCities = (provinceName, provinceCities) => {
  modalCitiesContainer.innerHTML = "";
  modalCitiesContainer.scrollTo(0, 0)
  const selectedCities = getFromLocal("edited-cities");
  const areAllCities = provinceCities.every((selectedCity) => {
    return selectedCities.some((city) => city.id == selectedCity.id);
  });

  modalCitiesContainer.insertAdjacentHTML(
    "afterbegin",
    `
  <li id="city_modal_all_province" class="city_modal_all_province" onclick="backToAllProvinces()">
    <span>همه شهر ها</span>
    <i class="bi bi-arrow-right-short"></i>
  </li>
  <li class="city-modal__cities-item select-all-city city-item" onclick="allProvinceBtnHandler('${
    provinceCities[0].province_id
  }')">
    <span>همه شهر های ${provinceName} </span>
    <div ${areAllCities ? 'class="active"' : ""}></div>
    <input type="checkbox" ${areAllCities ? 'checked="true"' : ""}/>
  </li>
  `
  );

  provinceCities.forEach((city) => {
    const isSelected = selectedCities.some(
      (selectedCity) => selectedCity.id == city.id
    );
    modalCitiesContainer.insertAdjacentHTML(
      "beforeend",
      generateProvinceCityTemplate(city, isSelected)
    );
  });
};

const provinceClickHandler = (event) => {
  const provinceID = event.target.dataset.provinceId;
  const provinceCities = allCities.cities.filter(
    (city) => city.province_id == provinceID
  );
  const provinceName = event.target.querySelector("span").innerHTML;

  insertProvinceCities(provinceName, provinceCities);
};

const renderProvinseCities = () => {
  const provinceItems = document.querySelectorAll(".province-item");

  provinceItems.forEach((province) => {
    province.addEventListener("click", provinceClickHandler);
  });
};

const insertSearchedCities = cities => {
  const citiesContainer = document.querySelector("#city_modal_list")
  citiesContainer.innerHTML = '';

  const selectedCities = getFromLocal("edited-cities");
  if (cities.length) {
    cities.forEach(city => {
      const isSelected = selectedCities.some(
        (selectedCity) => selectedCity.id == city.id
      );    
      citiesContainer.insertAdjacentHTML('beforeend', generateProvinceCityTemplate(city, isSelected))
    })
  }else{
    citiesContainer.innerHTML = `
      <div class="empty">
      شهری پیدا نشد ..
      </div>
    `
  }
  
}

const citiesSearchHandler = event => {
  const value = event.target.value.trim();
  if (!value) {
    renderAllProvinces();
    renderProvinseCities();
    return false
  }

  const searchedCities = allCities.cities.filter(city => city.name.includes(value))
  insertSearchedCities(searchedCities)
}

const renderCitiesSearching = () => {
  const searchInput = document.querySelector('#city-modal-search-input')

  searchInput.addEventListener('keyup', citiesSearchHandler)
}

export {
  modalAcceptBtnHandler,
  loadSelectedCities,
  deleteAllCitiesHandler,
  renderAllProvinces,
  renderProvinseCities,
  renderCitiesSearching
};
