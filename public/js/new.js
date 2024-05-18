import { getCategories } from "../../utils/posts.js";
import { getSubCategories, insertCategories, insertSearchedSubs } from "../../utils/news.js";
import { checkLogin, hideLoader } from "../../utils/shared.js";

const renderCategories = async () => {
  const categories = await getCategories();
  console.log(categories);
  insertCategories("yes", categories);
};

////// Searching SubCategories \\\\\
const searchInput = document.querySelector(".search_box input");
const cleanInputBtn = document.querySelector(".search_box i");
const searchResultEl = document.querySelector(".search_box div");

const hideInputAttachs = () => {
  cleanInputBtn.classList.remove('active')
  searchResultEl.classList.remove('active')
};

const showInputAttachs = () => {
  cleanInputBtn.classList.add('active')
  searchResultEl.classList.add('active')
}

const renderSubCategoriesSearching = async () => {
  const searchInput = document.querySelector(".search_box input");
  const cleanInputBtn = document.querySelector(".search_box i");
  const searchResultEl = document.querySelector(".search_box div");
  const allSubCategories = await getSubCategories();
  console.log(allSubCategories);
  searchInput.addEventListener("keyup", (e) => {
    const value = e.target.value.trim();
    if (value) {
      showInputAttachs();
      const searrchedSubs = allSubCategories.filter(sub => sub.title.includes(value));
      insertSearchedSubs(searrchedSubs)
    } else {
      hideInputAttachs();
    }
  });

  cleanInputBtn.addEventListener("click", () => {
    hideInputAttachs();
    searchInput.value = "";
  });
};

const pageFuncsHandler = async () => {
  renderSubCategoriesSearching();
  await renderCategories();
};

window.addEventListener("DOMContentLoaded", async () => {
  (await checkLogin()) || history.back();
  await pageFuncsHandler();
  hideLoader();
});
