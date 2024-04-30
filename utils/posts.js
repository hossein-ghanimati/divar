import { getFromLocal, mainURL, coverURL, addParamToUrl, calculateRelativeTimeDifference } from "./shared.js"

const getPosts = async () => {
  const userCities = getFromLocal('cities');
  const userCitiesIDs = userCities.map(city => city.id).join(' ');
  const getPostsReq = await fetch(`${mainURL}/post/?city=${userCitiesIDs}`)
  const response = await getPostsReq.json()
  return response.data.posts
}

const generatePostTemplate = post => {
  const date = calculateRelativeTimeDifference(post.createdAt)

  return `
    <div class="col-4">
      <a href="post.html/id=${post._id}" class="product-card">
        <div class="product-card__right">
          <div class="product-card__right-top">
            <p class="product-card__link">${post.title}</p>
          </div>
          <div class="product-card__right-bottom">
            <span class="product-card__condition">${
              post.dynamicFields[0].data
            }</span>
            <span class="product-card__price">
              ${
                post.price === 0
                  ? "توافقی"
                  : post.price.toLocaleString() + " تومان"
              }
            </span>
            <span class="product-card__time">${date}</span>
          </div>
        </div>
        <div class="product-card__left">
        ${
          post.pics.length
            ? `
              <img
                class="product-card__img img-fluid"
                src="${coverURL}/${post.pics[0].path}"
              />`
            : `
              <img
                class="product-card__img img-fluid"
                src="/public/images/main/noPicture.PNG"
              />`
        }
                  
        </div>
      </a>
    </div>
  `
}

const insertPosts = posts => {
  const postsContainer = document.querySelector('#posts-container')

  if (posts.length) {
    posts.forEach(post => {
      postsContainer.insertAdjacentHTML('beforeend', generatePostTemplate(post))
    });
  }else{
    postsContainer.insertAdjacentHTML('beforeend', `
      <p class="empty">
        پستی یافت نشد ..
      </p>
    `)
  }
}

const getCategories = async () => {
  const getReq = await fetch(`${mainURL}/category`)
  const response = await getReq.json()
  return response.data.categories
}

const categoryClickHandler = categoryID => {
  addParamToUrl('categoryID', categoryID)
}

const generateCategoryTemplate = category => {
  return`
    <div class="sidebar__category-link" id="category-${category._id}" onclick="categoryClickHandler('${category._id}')">
      <div class="sidebar__category-link_details">
        <i class="sidebar__category-icon bi bi-home"></i>
        <p>${category.title}</p>
      </div>    
    </div>
  `
}

const insertCategories = categories => {
  const categoriesContainer = document.querySelector('#categories-container')

  categories.forEach(category => {
    categoriesContainer.insertAdjacentHTML('beforeend', generateCategoryTemplate(category))
  })
}

window.categoryClickHandler = categoryClickHandler
export {
  getPosts,
  insertPosts,
  getCategories,
  insertCategories
}