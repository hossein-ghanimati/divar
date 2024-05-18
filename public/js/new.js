import { getCategories } from "../../utils/posts.js";
import { insertMainCategories } from "../../utils/news.js";
import { checkLogin, hideLoader } from "../../utils/shared.js";

const  renderCategories = async () => {
  const categories = await getCategories();

  insertMainCategories(categories)
}

const pageFuncsHandler = async () => {
  await renderCategories()
}

window.addEventListener('DOMContentLoaded', async () => {
  await checkLogin() || history.back()
  await pageFuncsHandler();
  hideLoader()
})