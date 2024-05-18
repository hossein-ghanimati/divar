const categoriesContainer = document.querySelector(".container section");
const descriptionCheckbox = document.querySelector(".switch input");
const isOnWhat = "main";
let localCategories = null;

const generateMainCategoriyTemplate = (category) => `
  <div class="box">
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

const insertMainCategories = (categories) => {
  localCategories = categories;
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    categoriesContainer.insertAdjacentHTML(
      "beforeend",
      generateMainCategoriyTemplate(category)
    );
  });
};

descriptionCheckbox.addEventListener("change", () => {
  if (isOnWhat == "main") {
    insertMainCategories(localCategories);
  }
});

export { insertMainCategories };
