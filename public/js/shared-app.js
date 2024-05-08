import { getFromLocal, getUrlParam, hideElem, removeUrlParam, setIntoLocal, setParamToUrl, showElem } from "../../utils/shared.js";
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
  
  mostSearchedsHandler()

  if(!input) return false

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
  let cities = getFromLocal('cities')

  if (!cities?.length) {
    setIntoLocal('cities', [{title : 'تهران', id: '301'}])
    cities = getFromLocal('cities')
  }

  if (cities.length > 1) {
    headerCitiesTitle.innerHTML = `${cities.length} شهر`
  }else{
    headerCitiesTitle.innerHTML = cities[0].title
  }

}
///////    Calling Functions    \\\\\\\\\
renderHeaderCities()
renderGlobalSearch()
renderSocials() 
formsPreventDefault()

