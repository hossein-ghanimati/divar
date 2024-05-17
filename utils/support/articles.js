const generateCategoryArticleTemplate = article => `
  <a href="./article.html?id=${
    article._id
  }" class="article">
      <div>
          <p>${article.title}</p>
          <span>${article.body.slice(0, 180)} ...</span>
      </div>
      <i class="bi bi-arrow-left"></i>
  </a>
`

const insertCategoryArticles = articles => {
  const articlesContainer = document.querySelector('#articles')
  articles.forEach(article => {
    articlesContainer.insertAdjacentHTML('beforeend', generateCategoryArticleTemplate(article))
  });
}

export {
  insertCategoryArticles
}