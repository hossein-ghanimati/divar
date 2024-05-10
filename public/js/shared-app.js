import { deleteAllCitiesHandler, loadSelectedCities, modalAcceptBtnHandler, renderAllProvinces, renderCitiesSearching, renderProvinseCities } from "../../utils/shared-app/cities-modal.js";
import { getFromLocal, getUrlParam, hideElem, hideModal, removeUrlParam, setIntoLocal, setParamToUrl, showElem, showModal } from "../../utils/shared.js";
import { getAllSocials, insertSocials } from "../../utils/shared-app/socials.js";
import { mostSearchedsHandler, searchInputHandler } from "../../utils/shared-app/global-search.js";

const renderSocials = async () => {
  const socials = await getAllSocials();
  console.log("Socials =>", socials);

  insertSocials(socials)
}

const renderGlobalSearch = () => {
  const input = document.querySelector('#global_search_input');
  const removeInputValueIcon = document.querySelector('#remove-search-value-icon')
  const searchedParam = getUrlParam('searched')
  if(!input) return false
  
  mostSearchedsHandler()


  if (searchedParam) showElem(removeInputValueIcon)

  input.value = searchedParam || '';

  input.addEventListener('keyup', searchInputHandler)

  removeInputValueIcon.addEventListener('click', () => removeUrlParam('searched'))

}

const formsPreventDefault = () => {
  const forms = document.querySelectorAll('form')
  forms.forEach(form => {
    form.addEventListener('submit',e => {
      e.preventDefault();
    })
  })
}

const renderHeaderCities = () => {
  const headerCitiesTitle = document.querySelector('#header-city-title')
  if (!headerCitiesTitle) return false
  let cities = getFromLocal('cities')

  if (!cities?.length) {
    setIntoLocal('cities', [{title : 'تهران', id: '301', province_id: 8}])
    cities = getFromLocal('cities')
  }

  if (cities.length > 1) {
    headerCitiesTitle.innerHTML = `${cities.length} شهر`
  }else{
    headerCitiesTitle.innerHTML = cities[0].title
  }

  if (cities.length < 4) {
    const citiesName = cities.map(city => city.title)
    document.title = `دیوار ${citiesName.join(' و ')}: مرجع انواع نیازمندی و آگهی‌های نو و دست دو در شهر ${citiesName.join(' و ')}`
  }else{
    document.title = `دیوار ${cities.length} شهر: مرجع انواع نیازمندی و آگهی‌های نو و دست دو در ${cities.length} شهر`
  }

}

const renderCitiesModal = () => {
  const modalActiveClass = "city-modal--active"
  const modalID = "#city-modal"
  const modalOpenBtn = document.querySelector('.header__city')
  if (!modalOpenBtn) return false
  const modalCloseBtn = document.querySelector('.city-modal__close')
  const modalAcceptBtn = document.querySelector('.city-modal__accept')
  const modalOverly = document.querySelector('.city-modal__overlay')

  deleteAllCitiesHandler()
  renderCitiesSearching()

  modalOpenBtn.addEventListener('click', async () => {
    setIntoLocal('edited-cities', getFromLocal('cities'))
    await renderAllProvinces()
    renderProvinseCities()
    loadSelectedCities()
    showModal(modalID, modalActiveClass)
  })
  modalCloseBtn.addEventListener('click', () => {
    hideModal(modalID, modalActiveClass)
    setIntoLocal('edited-cities', getFromLocal('cities'))
  })
  modalAcceptBtn.addEventListener('click', () => {
    hideModal(modalID, modalActiveClass)
    modalAcceptBtnHandler()
  })

  modalOverly.addEventListener('click', () => {
    hideModal(modalID, modalActiveClass)
    setIntoLocal('edited-cities', getFromLocal('cities'))
  })
  // console.log(modalCloseBtn.addEventListener);
}

const renderCategoriesModal = () => {
  const modalID = "#header__category-menu"
  const modalActiveClass = "header__category-menu--active"
  const modalOpenBtn = document.querySelector('.header__category-btn')
  const backToAllCategoriesBtn = document.querySelector('#all-categories-posts')
  const modalOverly = document.querySelector('.category_modal_overlay')

  modalOpenBtn.addEventListener('click', () => {
    showModal(modalID, modalActiveClass)
  })

  modalOverly.addEventListener('click', () => {
    hideModal(modalID, modalActiveClass)
  })

  backToAllCategoriesBtn.addEventListener('click', () => {
    removeUrlParam('categoryID')
  })
}
///////    Calling Functions    \\\\\\\\\
renderHeaderCities()
renderCitiesModal()
renderCategoriesModal()
renderGlobalSearch()
renderSocials() 
formsPreventDefault()



export{
  renderHeaderCities,
}