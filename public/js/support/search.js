import { getUrlParam, hideLoader } from "../../../utils/shared.js"
import { getSearchedArticles, insertSearchedArticles } from "../../../utils/support/search.js"

/////////////////       Functions       \\\\\\\\\\\\\\\\\\\

const renderSeearchedArticles = async () => {
  const breadcrumbSpan = document.querySelector('#breadcrumb span');
  const titleEl = document.querySelector('.search-title span');
  const searhcedValue = getUrlParam('value')

  breadcrumbSpan.innerHTML = searhcedValue;
  titleEl.innerHTML = `: ( ${searhcedValue} )`
  document.title = `نتایج جستجو - ${searhcedValue}`


  const searchedArticles = await getSearchedArticles()
  insertSearchedArticles(searchedArticles)  
}

const pageFuncsHandler = async () => {
  await renderSeearchedArticles()
}
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\

window.addEventListener('DOMContentLoaded', async () => {
  await pageFuncsHandler()
  hideLoader()
})