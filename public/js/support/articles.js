import { coverURL, getUrlParam, hideLoader } from "../../../utils/shared.js"
import { getAllArticles } from "../../../utils/sopport.js"
import { insertCategoryArticles } from "../../../utils/support/articles.js"
/////////////////       Functions       \\\\\\\\\\\\\\\\\\\


const renderCategoryArticles = async () => {
  const allArticles = await getAllArticles()
  const categoryID = getUrlParam('id')
  const mainCategory = allArticles.find(category => category._id == categoryID)
  const breadcrumbSpan = document.querySelector('#breadcrumb span')
  const categoryInfo = document.querySelector('#category-info')

  document.title = mainCategory.name;
  breadcrumbSpan.innerHTML = mainCategory.name;
  categoryInfo.insertAdjacentHTML('beforeend', `
    <img class="category-info-icon" src="${coverURL}/${mainCategory.pic.path}" />
    <p class="category-info-title">${mainCategory.name}</p>
  `)

  insertCategoryArticles(mainCategory.articles)  
}

const pageFuncsHandler = async () => {
  await renderCategoryArticles()
}
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\


window.addEventListener('DOMContentLoaded', async () => {
  await pageFuncsHandler()
  hideLoader()
})