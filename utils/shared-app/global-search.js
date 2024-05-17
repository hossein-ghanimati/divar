import { hideModal, setParamToUrl, showModal } from "../shared.js";

const searchInputHandler = () => {
  const value = event.target.value.trim();
  if (value == "") {
    hideElem(removeInputValueIcon);
    return false;
  } else {
    showElem(removeInputValueIcon);
  }

  if (event.keyCode == 13) {
    location.href = `./posts.html?searched=${value}`
  }
};


////   Start Most Searched Functions
const mostSearchClickHandler = searched => {
  location.href = `./posts.html?searched=${searched}`
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