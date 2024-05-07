import {
  getPosts,
  insertPosts,
  getCategories,
  insertMainCategories,
  handelMainCategories,
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

  // If We Clicked On A Category
  if (categoryID) {
    handelMainCategories(categories, categoryID);
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
