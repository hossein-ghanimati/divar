import { hideLoader } from "../../utils/shared.js"
import { generateArticleCategoryTemplate, generatePopArticleTemplate, getAllArticles, searchArticle, handelRemoveBtn } from "../../utils/sopport.js";
/////////////////       Variabels       \\\\\\\\\\\\\\\\\\\
let popularArticles = null;
let articlesCategories = null;
/////////////////       Functions       \\\\\\\\\\\\\\\\\\\

const loadAllArticles = async () => {
  const allArticles = await getAllArticles()
  console.log(allArticles);

  popularArticles = allArticles.find(
    article => article.shortName == "popular_articles"
  )?.articles

  articlesCategories = [...allArticles]
}

const renderPopularArticles = () => {
  const popularArticlesContainer = document.querySelector('#popular-articles')
  popularArticles.forEach(article => {
    popularArticlesContainer.insertAdjacentHTML('beforeend', generatePopArticleTemplate(article));
  });
}

const renderArticlesCategory = () => {
  const articlesCategoriesContainer = document.querySelector('#categories-container')
  
  articlesCategories.forEach(article => {
    articlesCategoriesContainer.insertAdjacentHTML('beforeend', generateArticleCategoryTemplate(article))
  })
}

const handelArticleSearch = () => {
  const searchInput = document.querySelector('#search-input')
  const searchBtn = document.querySelector('.input-search-icon')

  searchInput.addEventListener('keyup', e => {
    searchArticle(e.keyCode)
  })

  handelRemoveBtn()
}

const renderPageFuncs = async () => {
  await loadAllArticles()
  handelArticleSearch(0)
  renderPopularArticles();
  renderArticlesCategory()
}
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\


window.addEventListener('DOMContentLoaded',async () => {
  await renderPageFuncs()
  hideLoader()
})