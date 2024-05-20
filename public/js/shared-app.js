import { deleteAllCitiesHandler, loadSelectedCities, modalAcceptBtnHandler, renderAllProvinces, renderCitiesSearching, renderProvinseCities } from "../../utils/shared-app/cities-modal.js";
import { checkLogin, getFromLocal, getUrlParam, hideElem, hideModal, removeUrlParam, setIntoLocal, setParamToUrl, showElem, showLoader, showModal } from "../../utils/shared.js";
import { getAllSocials, insertSocials } from "../../utils/shared-app/socials.js";
import { mostSearchedsHandler, searchInputHandler } from "../../utils/shared-app/global-search.js";
import { insertModalCategories } from "../../utils/shared-app/categories-modal.js";
import { handelModalSubmit } from "../../utils/shared-app/login-modal1.js";
import { getMe } from "./auth.js";

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
  const modalCloseBtn = document.querySelector('.city-modal__close')
  const modalAcceptBtn = document.querySelector('.city-modal__accept')
  const modalOverly = document.querySelector('.city-modal__overlay')
  
  if (!modalOpenBtn || modalOverly || modalAcceptBtn) return false

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

  if (!modalOverly) return false


  insertModalCategories()

  modalOpenBtn.addEventListener('click', () => {
    showModal(modalID, modalActiveClass)
  })

  modalOverly.addEventListener('click', () => {
    hideModal(modalID, modalActiveClass)
  })

  backToAllCategoriesBtn.addEventListener('click', () => {
    location.href = "./posts.html"
  })
}

const renderLoginModal1 = () => {
  const loginModalCloseBtn = document.querySelector('.login-modal__header-btn')
  if (!loginModalCloseBtn) return false
  loginModalCloseBtn.addEventListener('click', () => {
    hideModal('#login-modal', 'login-modal--active')
  })

  handelModalSubmit()
}

const handelCreatePostBtn = () => {
  const createPostBtn = document.querySelector('.create_post_btn')
  if (!createPostBtn) return false
  createPostBtn.addEventListener('click', async () => {
    try{
      hideModal('.header__category-menu', 'header__category-menu--active')
      hideModal('.city-modal', 'city-modal--active')
      hideElem('.header__searchbar-dropdown', "header__searchbar-dropdown--active")
    }catch{}
    const isLogin = await checkLogin()
    if (isLogin) {
      location.href = "./new.html"
    }else{
      showModal('#login-modal', 'login-modal--active')
    }
  })
}

const renderPanelLinks = async () => {
  const panelLinksBtn = document.querySelector('.dropdown-toggle')
  const panelLinksContainer = document.querySelector('.header_dropdown_menu')
  if (!panelLinksContainer) return false;
  const locationPath = location.pathname
  const isLogin = await checkLogin()
  const user = await getMe()
  const linksTemplate = 
    isLogin ?
      `
        <li class="header__left-dropdown-item header_dropdown-item_account">
          <a
            href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/posts.html"
            class="header__left-dropdown-link login_dropdown_link"
          >
            <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
            <div>
              <span>کاربر دیوار </span>
              <p>تلفن ${user.phone}</p>
            </div>
          </a>
        </li>
        <li class="header__left-dropdown-item">
          <a class="header__left-dropdown-link" href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/verify.html">
            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
            تایید هویت
          </a>
        </li>
        <li class="header__left-dropdown-item">
          <a class="header__left-dropdown-link" href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/bookmarks.html">
            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
            نشان ها
          </a>
        </li>
        <li class="header__left-dropdown-item">
          <a class="header__left-dropdown-link" href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/notes.html">
            <i class="header__left-dropdown-icon bi bi-journal"></i>
            یادداشت ها
          </a>
        </li>
        <li class="header__left-dropdown-item logout-link" id="login_out" onclick="logoutHandler()">
          <p class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-shop"></i>
            خروج
          </p>
        </li>
      `
    :
      `
        <li class="header__left-dropdown-item">
          <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
            <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
            ورود
          </span>
        </li>
        <li class="header__left-dropdown-item">
          <div class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
            نشان ها
          </div>
        </li>
        <li class="header__left-dropdown-item">
          <div class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-journal"></i>
            یادداشت ها
          </div>
        </li>
        <li class="header__left-dropdown-item">
          <div class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-clock-history"></i>
            بازدید های اخیر
          </div>
        </li>
      `

  panelLinksContainer.insertAdjacentHTML('beforeend', linksTemplate)

  if (!isLogin) {
    panelLinksContainer.addEventListener('click', () => {
      showModal('#login-modal', 'login-modal--active')
    })
  }
}

const logoutHandler = () => {
  console.log('logouting ...');
  showLoader()
  localStorage.removeItem('divar-token') 
  sessionStorage.removeItem('divar-user')
  window.location.reload()
}
///////    Calling Functions    \\\\\\\\\
renderHeaderCities()
renderCitiesModal()
renderCategoriesModal()
renderGlobalSearch()
renderSocials() 
formsPreventDefault()
renderLoginModal1()
handelCreatePostBtn()
renderPanelLinks(0)
window.logoutHandler = logoutHandler


export{
  renderHeaderCities,
}