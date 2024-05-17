import { hideLoader } from "../../../utils/shared.js"
import { getArticleInfo, handelRelatedArtilces } from "../../../utils/support/article.js"
/////////////////       Variabels       \\\\\\\\\\\\\\\\\\\
/////////////////       Functions       \\\\\\\\\\\\\\\\\\\

const renderArticleInfo = async () => {
  const articleInfo = await getArticleInfo()
  console.log("Article Info =>", articleInfo);
  const breadcrumbSpan = document.querySelector('#breadcumb span')
  const articleTitleEl = document.querySelector('#article-title')
  const articleBodyEl = document.querySelector('#article-body')

  handelRelatedArtilces(articleInfo.categories[0])

  document.title = articleInfo.title
  breadcrumbSpan.innerHTML = articleInfo.title
  articleTitleEl.innerHTML = articleInfo.title
  articleBodyEl.innerHTML = articleInfo.body
}

const pageFuncsHandler = async () => {
  await renderArticleInfo()
}
/////////////////       Events /Codes       \\\\\\\\\\\\\\\\\\\
window.addEventListener('DOMContentLoaded', async () => {
  await pageFuncsHandler()
  hideLoader()
})