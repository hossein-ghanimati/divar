import {
  getPosts,
  insertPosts,
  getCategories,
  insertCategories,
  handelMainCategories,
  insertFilters,
  staticCheckFiltersApplyHandler,
  staticSelectFiltersApplyHandler,
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
    insertCategories(categories);

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
}

const pageFuncsHandler = async () => {
  await renderPosts();
  await renderCategories();
  await renderFilters();
  filstersApplyHandler()
};
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
window.addEventListener("load", async () => {
  if (!location.pathname.endsWith('posts.html')) return false
  await pageFuncsHandler();
  hideLoader();
});


export {
  pageFuncsHandler
}