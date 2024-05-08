import { hideModal, showModal } from "../shared.js";

const searchInputHandler = () => {
  const value = event.target.value.trim();
  if (value == "") {
    hideElem(removeInputValueIcon);
    return false;
  } else {
    showElem(removeInputValueIcon);
  }

  if (event.keyCode == 13) {
    setParamToUrl("searched", value);
  }
};


////   Start Most Searched Functions
const mostSearchClickHandler = searched => {
  const url = new URL(location.href)
  let searchParams = new URLSearchParams(location.search)
  searchParams.set('searched', searched)

  url.search = searchParams.toString()
  location.href = url.toString()
}

const generateSearchedItemTemplate = searched => {
  return `
    <li class="header__searchbar-dropdown-item">
      <a onclick="mostSearchClickHandler('${searched}')" href="#" class="header__searchbar-dropdown-link">
        ${searched}
      </a>
    </li>
  `
}

const insertMostSearcheds = () => {
  const mostSearchedsContainer = document.querySelector('#most_searched');
  const mostSearcheds = ['ماشین', 'سامسونگ', 'لباس', 'کیف', 'کفش']

  mostSearcheds.forEach(searched => {
    mostSearchedsContainer.insertAdjacentHTML("beforeend", generateSearchedItemTemplate(searched))
  })
}

const mostSearchedsHandler = () => {
  const input = document.querySelector('#global_search_input');
  
  insertMostSearcheds()

  input.addEventListener('focus', () => {
    showModal('#header__searchbar-dropdown', 'header__searchbar-dropdown--active')
  })

  input.addEventListener('blur', () => {
    hideModal('#header__searchbar-dropdown', 'header__searchbar-dropdown--active')
  })
}
////   End Most Searched Functions

window.mostSearchClickHandler = mostSearchClickHandler
export {
  searchInputHandler,
  mostSearchedsHandler
}