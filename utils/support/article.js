import { getUrlParam, mainURL } from "../shared.js"

const getArticleInfo = async () => {
  const articleID = getUrlParam('id')
  const getReq = await fetch(`${mainURL}/support/articles/${articleID}`)
  const response = await getReq.json()
  return response.data.article
}

const getRelatedArticles = async categoryID => {
  const getReq = await fetch(`${mainURL}/support/categories/${categoryID}/articles`)
  const response = await getReq.json()
  const articles =  response.data.articles
  const filteresArticles = articles.filter(article => article._id != getUrlParam('id'))
  return filteresArticles
}

const generateRelatedArticleTemplate = article => `
  <a href="./article.html?id=${article._id}">
    ${article.title}
  </a>
`

const handelRelatedArtilces = async (categoryID) => {
  const relatedArticlesContainer = document.querySelector('#same-articles')
  const relatedArticles = await getRelatedArticles(categoryID)

  relatedArticles.forEach(article => {
    relatedArticlesContainer.insertAdjacentHTML('beforeend', generateRelatedArticleTemplate(article))
  });
}


export{
  getArticleInfo,
  handelRelatedArtilces
}