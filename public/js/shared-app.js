import { getUrlParam, hideElem, removeUrlParam, setParamToUrl, showElem } from "../../utils/shared.js";
import { getAllSocials, insertSocials } from "../../utils/socials.js";

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
  if (searchedParam) showElem(removeInputValueIcon)

  input.value = searchedParam || '';

  input.addEventListener('keyup', e => {
    const value = e.target.value.trim();
    if (value == ''){
      hideElem(removeInputValueIcon);
      return false
    }else{
      showElem(removeInputValueIcon);
    }

    if (e.keyCode == 13) {
      setParamToUrl('searched', value)
    }
  })

  removeInputValueIcon.addEventListener('click', () => {
    removeUrlParam('searched')
  })
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

