import {
  getPosts,
  insertPosts,
  getCategories,
  insertMainCategories,
  insertChildCategory,
  getCategory,
  getChildCategory,
  getSubParentCategory
} from "../../utils/posts.js";
import { getUrlParam, hideLoader } from "../../utils/shared.js";

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\

/////////////////       Functions       \\\\\\\\\\\\\\\\\\\
const renderPosts = async () => {
  const posts = await getPosts();
  console.log("Posts =>", posts);

  insertPosts(posts);
};

const renderCategories = async () => {
  const categoryID = getUrlParam("categoryID");
  const categories = await getCategories();
  console.log("Categories =>", categories);

  if (categoryID) {
    const categoryInfos = getCategory(categories, categoryID);
    const isMainCategory = categoryInfos ? true : false;
    
    if (isMainCategory) {
      console.log("Category Infos =>", categoryInfos);
      insertChildCategory(categoryInfos);
    }else {
      const childCategoryInfos = getChildCategory(categories, categoryID);
      const isChildCategory = childCategoryInfos ? true : false;
      
      if (isChildCategory) {
        console.log("Child Category Infos =>", childCategoryInfos);
        insertChildCategory(childCategoryInfos)
      }else{
        const subParentCategory = getSubParentCategory(categories, categoryID)
        console.log("Sub Parent Category Infos =>", subParentCategory);
        insertChildCategory(subParentCategory)
      }
    }
  } else {
    insertMainCategories(categories);
  }
};

const pageFuncsHandler = async () => {
  renderCategories();
  await renderPosts();
};
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
window.addEventListener("load", async () => {
  await pageFuncsHandler();
  hideLoader();
});
