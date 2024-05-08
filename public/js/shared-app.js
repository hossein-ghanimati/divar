import { getUrlParam, hideElem, removeUrlParam, setParamToUrl, showElem } from "../../utils/shared.js";
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

///////    Calling Functions    \\\\\\\\\
formsPreventDefault()
renderSocials() 
renderGlobalSearch()

