import { getUrlParam, mainURL } from "../shared.js"

const getSearchedArticles = async () => {
  const searhcedValue = getUrlParam("value")
  const getReq = await fetch(`${mainURL}/support/articles/search?s=${searhcedValue}`)
  const response = await getReq.json()
  return response.data.articles
}

const generateSearchedArticleTemplate = article => `
  <a href="./article.html?id=${article._id}">
    <div>${article.title}</div>
    <i class="bi bi-chevron-left"></i>
  </a>
`

const insertSearchedArticles = searchedArticles => {
  const searchedArticlesContainer = document.querySelector('#search-results')
  if (searchedArticles.length) {
    searchedArticles.forEach(article => {
      searchedArticlesContainer.insertAdjacentHTML('beforeend',
        generateSearchedArticleTemplate(article)
      )
    });
  }else{
    searchedArticlesContainer.insertAdjacentHTML('beforeend', `
      <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" />
      <p>نتیجه ای برا جستجوی شما یافت نشد.</p>
      <span>پیشنهاد میکنیم که:</span>
      <span>نگارش کلمات خود را مجددا بررسی کنید.</span>
      <span>کلمات کلیدی دیگری را  برای جستجو انتخاب کنید.</span>
    `)
  }
}

export {
  getSearchedArticles,
  insertSearchedArticles
}