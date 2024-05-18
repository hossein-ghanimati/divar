import { mainURL } from "./shared.js";

const categoriesContainer = document.querySelector(".container section");
const descriptionCheckbox = document.querySelector(".switch input");
let isOnWhat = "main";
let localMainCategories = null;
let localCategories = null

const generateCategoryTemplate = (category) => `
  <div class="box" onclick="categoryClickHandler('${category._id}')">
    <div class="details">
      <div>
          <i class="bi bi-house-door"></i>
          <p>${category.title}</p>
      </div>

      ${
        descriptionCheckbox.checked
          ? `<span>${category.description}</span>`
          : ""
      }
    </div>

    <i class="bi bi-chevron-left"></i>
  </div>
`;

const insertCategories = (isMainCategories, categories, title, id) => {

  isMainCategories ? localMainCategories = categories : localCategories = {categories, title, id};
  categoriesContainer.innerHTML = '';

  if (title) {
    categoriesContainer.insertAdjacentHTML('beforeend', `
      <div class="back" onclick="goBackCategory('${id}')">
        <i class="bi-arrow-right"></i>
        <span>بازگشت به ${title}</span>
      </div>
    `)
  }

  categories.forEach((category) => {
    categoriesContainer.insertAdjacentHTML(
      "beforeend",
      generateCategoryTemplate(category)
    );
  });
};

const findCategory = categoryID => {
  return localMainCategories.find(category => category._id == categoryID)
}

const findChildCategoryInfo = categoryID => {
  let childParentTitle = null;
  let childParentID = null;
  let childCategory = localMainCategories.find(category =>{
     
    if(category?.subCategories?.find(childCategory => childCategory._id == categoryID)){
      childParentTitle = category.title
      childParentID = category._id
      return true
    }
  
  })
   ?.subCategories.find(childCategory => childCategory._id == categoryID)

  return {childCategory, childParentTitle, childParentID}
}

window.goBackCategory = categoryID => {
  console.log(categoryID);
  if (categoryID) {
    isOnWhat = "child"
    const category = findCategory(categoryID)
    insertCategories(false, category.subCategories, 'همه آگهی ها', '')
    localCategories = {categories: category.subCategories, title: 'همه آگهی ها', id: ''}
  }else{
    insertCategories(true, localMainCategories)
    isOnWhat = "main"
  }
}

window.categoryClickHandler = categoryID => {
  const category = findCategory(categoryID)
  
  isOnWhat = "child"

  if (category) {
    insertCategories(false, category.subCategories, 'همه آگهی ها', '')
    localCategories = {categories: category.subCategories, title: 'همه آگهی ها', id: ''}
  }else{
    const chidlCategoryInfo  = findChildCategoryInfo(categoryID)
    if (chidlCategoryInfo.childCategory) {
      insertCategories(
        false,
        chidlCategoryInfo.childCategory.subCategories,
        chidlCategoryInfo.childParentTitle, 
        chidlCategoryInfo.childParentID
      )    
      localCategories = {
        categories: chidlCategoryInfo.childCategory.subCategories, 
        title: chidlCategoryInfo.childParentTitle, 
        id: chidlCategoryInfo.childParentID
      }
    }else{
      location.href = `./new/registerPost.html?categoryID=${categoryID}`
    }
  }
}

descriptionCheckbox.addEventListener("change", () => {
  if (isOnWhat == "main") {
    console.log('dfsdf');
    insertCategories(true, localMainCategories);
  }else{
    insertCategories(false, localCategories.categories, localCategories.title, localCategories.id);
  }
});

////////    Sub Categories Searching  \\\\\\\\\\\

const getSubCategories = async () => {
  const getReq = await fetch(`${mainURL}/category/sub`);
  const response = await getReq.json();
  return response.data.categories
}

const generateSearchedSubTemplate = sub =>`
  <a href="./new/registerPost.html?categoryID=${sub._id}" class="search-result">
    <p>${sub.title}</س>
    <i class="bi-chevron-left"></i>
  </a>
`

const insertSearchedSubs = searchedSubs => {
  const searchResultEl = document.querySelector(".search_box div");
  searchResultEl.innerHTML = ''

  if (searchedSubs.length) {
    searchedSubs.forEach(sub => {
      searchResultEl.insertAdjacentHTML('beforeend', generateSearchedSubTemplate(sub))
    })
  }else{
    searchResultEl.insertAdjacentHTML('beforeend', ` 
      <div class="empty">
        <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg">
        <p>دسته بندیی یافت نشد.</p>
      </div>
    `)
  }
}

export { insertCategories, getSubCategories, insertSearchedSubs };

