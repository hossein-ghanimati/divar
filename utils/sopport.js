import { coverURL, mainURL } from "./shared.js"

const getAllArticles = async () =>{
  const res = await fetch(`${mainURL}/support/category-articles`);
  const response = await res.json();

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

export{
  getAllArticles,
  generatePopArticleTemplate,
  generateArticleCategoryTemplate
}