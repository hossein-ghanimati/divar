import {
  getPosts,
  insertPosts,
  getCategories,
  insertMainCategories,
  handelMainCategories,
  insertFilters,
  staticCheckFiltersApplyHandler,
  staticSelectFiltersApplyHandler,
  dynamicCheckFiltersApplyHandler,
} from "../../utils/posts.js";
import { getFromLocal, getUrlParam, hideLoader, setIntoLocal } from "../../utils/shared.js";

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\
let mainPosts = null;

/////////////////       Functions       \\\\\\\\\\\\\\\\\\\
const renderPosts = async () => {
  const posts = await getPosts();
  mainPosts = posts
  console.log("Posts =>", posts);

  insertPosts(posts);
};

const renderCategories = async () => {
  const categoryID = getUrlParam("categoryID");
  const categories = await getCategories();
  const categoriesContainer = document.querySelector('#categories-container')
  categoriesContainer.innerHTML = ''
  
  // If We Clicked On A Category
  if (categoryID) {
    handelMainCategories(categories, categoryID);
  } else {
    setIntoLocal('category', categories)
    insertMainCategories(categories);

    console.log("Categories =>", categories);
  }

  
};

const renderFilters = () => {
  const categoryFilters = getFromLocal('category')?.filters;
  if (!categoryFilters?.length) return false;
  

  insertFilters(categoryFilters.reverse())  
}

const filstersApplyHandler = () => {
  staticCheckFiltersApplyHandler();
  staticSelectFiltersApplyHandler();
  dynamicCheckFiltersApplyHandler();
}

const pageFuncsHandler = async () => {
  await renderPosts();
  await renderCategories();
  await renderFilters();
  filstersApplyHandler()
};
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
window.addEventListener("load", async () => {
  await pageFuncsHandler();
  hideLoader();
});


export {
  pageFuncsHandler
}