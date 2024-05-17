import { coverURL, mainURL } from "./shared.js"
const searchInput = document.querySelector('#search-input')
const searchResultEl = document.querySelector("#search-result")
const removeInputValueEl = document.querySelector('#remove-icon')
const articles = [];

const getAllArticles = async () =>{
  const res = await fetch(`${mainURL}/support/category-articles`);
  const response = await res.json();
  response.data.categories.forEach(category => {
    category.articles.forEach(article => {
      articles.push(article)
    });
  });
  return response.data.categories;
}

const generatePopArticleTemplate = article => `
  <a href="./support/article.html?id=${
    article._id
    }" class="article">
      <p>${article.title}</p>
      <span>${article.body.slice(0, 180)} ...</span>
      <div>
      <i class="bi bi-arrow-left"></i>
      <p>ادامه مقاله</p>
      </div>
  </a>
`

const generateArticleCategoryTemplate = category => `
  <a href="./support/articles.html?id=${category._id}">
      <img src="${coverURL}/${category.pic.path}" width="64" height="64" alt="" />
      <div>
      <p>${category.name}</p>
      <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از
      </span>
      </div>
      <i class="bi bi-chevron-left"></i>
  </a>
`

const showInputAttachs = () => {
  searchResultEl.classList.add('active')
  removeInputValueEl.classList.add('active')
}

const hideInputAttachs = () => {
  searchResultEl.classList.remove('active')
  removeInputValueEl.classList.remove('active')
}

const handelRemoveBtn = () => {
  removeInputValueEl.addEventListener('click', () => {
    hideInputAttachs()
    searchInput.value = ''
  })
}

const generateStaticSearchItemTemplate = searchedValue => `
  <a href="./support/search.html?value=${searchedValue}">
    <i class="bi bi-search"></i>
    ${searchedValue}
  </a>
`

const insertStaticSearchItem = searchedValue => {
  searchResultEl.insertAdjacentHTML('beforeend', generateStaticSearchItemTemplate(searchedValue))
}

const generateSearchedItemTemplate = article => `
  <a href="./support/article.html?id=${article._id}">
    <i class="bi bi-card-text"></i>
    ${article.title}
  </a>
`

const insertSearchedItems = filteredArticles => {
  filteredArticles.forEach(article => {
    searchResultEl.insertAdjacentHTML('beforeend', generateSearchedItemTemplate(article))
  })
}


const searchArticle = keyCode => {
  searchResultEl.innerHTML = ''
  const searchValue = searchInput.value.trim();
  if (keyCode == 13) {
    location.href = `./support/search.html?value=${searchValue}`
    return false
  }
  
  if (searchValue) {
    showInputAttachs()
    const filteredArticles = articles.filter(article => article.title.includes(searchValue))
    if (filteredArticles.length) {
      insertStaticSearchItem(searchValue)
      insertSearchedItems(filteredArticles)
    }else{
      insertStaticSearchItem(searchValue)
    }
  }else{
    hideInputAttachs()
  }
}

export{
  getAllArticles,
  generatePopArticleTemplate,
  generateArticleCategoryTemplate,
  searchArticle,
  handelRemoveBtn
}