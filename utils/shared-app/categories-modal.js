import { getCategories, categoryClickHandler } from "../posts.js";
let categories = null;


const generateModalCategoryTemplate = category => `
  <li class="header__category-menu-item" onmouseenter="showModalActiveCategorySubs('${category._id}')">
    <div class="header__category-menu-link">
      <div class="header__category-menu-link-right">
        <i class="header__category-menu-icon bi bi-house"></i>
        ${category.title}
      </div>
      <div class="header__category-menu-link-left">
        <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
      </div>
    </div>
  </li>
`
const insertModalCategories = async () => {
  const categoriesContainer = document.querySelector('#categories-list')
  categories = await getCategories();

  categories.forEach(category => {
    categoriesContainer.insertAdjacentHTML('beforeend', generateModalCategoryTemplate(category))
  });

  showModalActiveCategorySubs(categories[0]._id)
}

const generateModalChildTemplate = childCategory => `
  <div>
    <ul class="header__category-dropdown-list">
      <div class="header__category-dropdown-title">${
        childCategory.title
      }</div>
      ${childCategory.subCategories
        .map(
          (subCategory) => `
          <li class="header__category-dropdown-item">
            <a onclick="categoryClickHandler('${subCategory._id}')" class="header__category-dropdown-link">${subCategory.title}</a>
          </li>
        `
        )
        .join("")}
    </ul>
  </div>
`

const insertModalChildCategories = childCategories => {
  const childCategoriesContainer = document.querySelector('#category-results')
  childCategoriesContainer.innerHTML = ''

  childCategories.forEach(childCategory => 
      childCategoriesContainer.insertAdjacentHTML('beforeend', generateModalChildTemplate(childCategory))
    )
}

window.showModalActiveCategorySubs = categoryID => {
  const activeCategory = categories.find(category => category._id == categoryID)

  insertModalChildCategories(activeCategory.subCategories)
}

export{
  insertModalCategories
}