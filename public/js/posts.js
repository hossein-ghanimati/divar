import {
  getPosts,
  insertPosts,
  getCategories,
  insertMainCategories,
  handelMainCategories,
  insertFilters
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

const pageFuncsHandler = async () => {
  await renderPosts();
  await renderCategories();
  renderFilters();
};
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
window.addEventListener("load", async () => {
  await pageFuncsHandler();
  hideLoader();
});
