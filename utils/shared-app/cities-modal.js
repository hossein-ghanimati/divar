import { getFromLocal, hideElem, mainURL, setIntoLocal, showElem } from "../shared.js";
import { renderHeaderCities } from "../../public/js/shared-app.js";
import { pageFuncsHandler } from "../../public/js/posts.js";

const selectedCitiesDeleteBtn = document.querySelector('#delete-all-cities')
const selectedCitiesContainer = document.querySelector('#city-selected')
const modalCitiesContainer = document.querySelector('#city_modal_list')


const getAllCities = async () => {
  const getReq = await fetch(`${mainURL}/location`)
  const response = await getReq.json()
  const allCities = response.data

  return allCities
}

const allCities = await getAllCities()
// console.log(allCities);


window.removeCityFromModal = cityID => {
  console.log("City ID ->", cityID);
}

const generateSelectedCityTemplate = city => {
  return `
  <div class="city-modal__selected-item">
    <span class="city-modal__selected-text">${city.title}</span>
    <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
      <i class="city-modal__selected-icon bi bi-x"></i>
    </button>
  </div>
  `
}

const loadSelectedCities = (city) => {
  selectedCitiesContainer.innerHTML = '';
  const selectedCities = city || getFromLocal('cities')

  if (selectedCities.length) {
    showElem(selectedCitiesDeleteBtn)
  }else{
    hideElem(selectedCitiesDeleteBtn)
  }

  selectedCities.forEach(city => {
    selectedCitiesContainer.insertAdjacentHTML('beforeend', generateSelectedCityTemplate(city))
  });
}

const deleteAllCitiesHandler = () => {
  selectedCitiesDeleteBtn.addEventListener('click', () => {
    setIntoLocal('edited-cities', []);
    loadSelectedCities([])
  })
}


const modalAcceptBtnHandler = () => {
  const editedCities = getFromLocal('edited-cities')
  setIntoLocal("cities", editedCities)
  pageFuncsHandler()
  renderHeaderCities()
}

const generateModalProvinceTemplate = province => {
  return `
  <li
    class="city-modal__cities-item province-item"
    data-province-id="${province.id}"
  >
    <span>${province.name}</span>
    <i class="city-modal__cities-icon bi bi-chevron-left"></i>
  </li>
  `
}

const renderAllProvinces = async () => {
  modalCitiesContainer.innerHTML = '';
  allCities?.provinces?.forEach(province => {
    modalCitiesContainer.insertAdjacentHTML('beforeend', generateModalProvinceTemplate(province))
  })
}

const generateProvinceCityTemplate = (city, isSelected = false) => {
  return `
  <li class="city-modal__cities-item city-item" id="city-${city.id}">
    <span>${city.name}</span>
    <div id="check_city-${city._slug}" class="${isSelected ? 'active' : ''}"></div>
    <input id="input_city-${city.id}" type="checkbox" checked="${isSelected}"/>
  </li>
  `
}

const insertProvinceCities = provinceCities => {
  modalCitiesContainer.innerHTML = '';
  const selectedCities = getFromLocal('edited-cities')

  provinceCities.forEach(city => {
    const isSelected = selectedCities.some(selectedCity => selectedCity.id == city.id)
    modalCitiesContainer.insertAdjacentHTML('beforeend', generateProvinceCityTemplate(city, isSelected))
  })
}

const provinceClickHandler = event => {
  const provinceID = event.target.dataset.provinceId;
  const provinceCities = allCities.cities.filter(city => city.province_id == provinceID)

  insertProvinceCities(provinceCities)
}

const renderProvinseCities = () => {
  const provinceItems = document.querySelectorAll('.province-item')

  provinceItems.forEach(province => {
    province.addEventListener('click', provinceClickHandler)
  })
}


export{
  modalAcceptBtnHandler,
  loadSelectedCities,
  deleteAllCitiesHandler,
  renderAllProvinces,
  renderProvinseCities
}