import {
  getFromLocal,
  mainURL,
  coverURL,
  setParamToUrl,
  calculateRelativeTimeDifference,
  getUrlParam,
  removeUrlParam,
} from "./shared.js";

const getPosts = async () => {
  const userCities = getFromLocal("cities");
  const userCitiesIDs = userCities.map((city) => city.id).join(" ");
  const getPostsReq = await fetch(`${mainURL}/post/?city=${userCitiesIDs}`);
  const response = await getPostsReq.json();
  return response.data.posts;
};

const backToAllCategories = () => {
  removeUrlParam("categoryID");
};

const generatePostTemplate = (post) => {
  const date = calculateRelativeTimeDifference(post.createdAt);

  return `
    <div class="col-4">
      <a href="post.html/id=${post._id}" class="product-card">
        <div class="product-card__right">
          <div class="product-card__right-top">
            <p class="product-card__link">${post.title}</p>
          </div>
          <div class="product-card__right-bottom">
            <span class="product-card__condition">${
              post.dynamicFields[0].data
            }</span>
            <span class="product-card__price">
              ${
                post.price === 0
                  ? "توافقی"
                  : post.price.toLocaleString() + " تومان"
              }
            </span>
            <span class="product-card__time">${date}</span>
          </div>
        </div>
        <div class="product-card__left">
        ${
          post.pics.length
            ? `
              <img
                class="product-card__img img-fluid"
                src="${coverURL}/${post.pics[0].path}"
              />`
            : `
              <img
                class="product-card__img img-fluid"
                src="../public/images/main/noPicture.PNG"
              />`
        }
                  
        </div>
      </a>
    </div>
  `;
};

const insertPosts = (posts) => {
  const postsContainer = document.querySelector("#posts-container");

  if (posts.length) {
    posts.forEach((post) => {
      postsContainer.insertAdjacentHTML(
        "beforeend",
        generatePostTemplate(post)
      );
    });
  } else {
    postsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <p class="empty">
        پستی یافت نشد ..
      </p>
    `
    );
  }
};

const getCategories = async () => {
  const getReq = await fetch(`${mainURL}/category`);
  const response = await getReq.json();
  return response.data.categories;
};

const categoryClickHandler = (categoryID) => {
  setParamToUrl("categoryID", categoryID);
};

const generateCategoryTemplate = (category) => {
  return `
    <div class="sidebar__category-link" id="category-${category._id}" onclick="categoryClickHandler('${category._id}')">
      <div class="sidebar__category-link_details">
        <i class="sidebar__category-icon bi bi-home"></i>
        <p>${category.title}</p>
      </div>    
    </div>
  `;
};

const insertMainCategories = (categories) => {
  const categoriesContainer = document.querySelector("#categories-container");

  categories.forEach((category) => {
    categoriesContainer.insertAdjacentHTML(
      "beforeend",
      generateCategoryTemplate(category)
    );
  });
};

const generateSubCategoryTemplate = (subCategory) => {
  console.log("Sub => ", subCategory);
  return `
    <li onclick="categoryClickHandler('${subCategory._id}')" 
    class="${
      getUrlParam("categoryID") == subCategory._id ? "active-subCategory" : ""
    }"
    >
      ${subCategory.title}
    </li>
  `;
};

const generateChildCategoryTemplate = (childCategory) => {
  return `
  <div class="all-categories" onclick="backToAllCategories('')">
    <p>همه اگهی ها</p>
    <i class="bi bi-arrow-right"></i>
  </div>

  <div class="sidebar__category-link active-category" href="#">
    <div class="sidebar__category-link_details">
      <i class="sidebar__category-icon bi bi-house"></i>
      <p onclick="categoryClickHandler('${childCategory._id}')">${
    childCategory.title
  }</p>
    </div>
    <ul class="subCategory-list">
      ${childCategory.subCategories.map(generateSubCategoryTemplate).join("")}
    </ul>
  </div>
  `;
};

const insertChildCategories = (childCategory) => {
  const categoriesContainer = document.querySelector("#categories-container");

  categoriesContainer.insertAdjacentHTML(
    "beforeend",
    generateChildCategoryTemplate(childCategory)
  );
};

const getCategory = (categories, categoryID) => {
  return categories.find((category) => category._id == categoryID);
};

const getChildCategory = (categories, categoryID) => {
  const category = categories.find((category) => {
    return category?.subCategories?.find((childCategory) => {
      return childCategory._id == categoryID;
    });
  });

  const childCategory = category?.subCategories?.find((childCategory) => {
    return childCategory._id == categoryID;
  });

  return childCategory;
};

const getSubParentCategory = (categories, categoryID) => {
  const category = categories.find((category) => {
    return category.subCategories.find((childCategory) => {
      return childCategory.subCategories.find((subCategory) => {
        return subCategory._id == categoryID;
      });
    });
  });

  const childCategory = category.subCategories.find((childCategory) => {
    return childCategory.subCategories.find((subCategory) => {
      return subCategory._id == categoryID;
    });
  });

  return childCategory;
};

const handelSubParentCategory = (categories, categoryID) => {
  const subParentCategory = getSubParentCategory(categories, categoryID);

  console.log("Sub Parent Category Infos =>", subParentCategory);
  insertChildCategories(subParentCategory);
};

const handelChildCategories = (categories, categoryID) => {
  const childCategoryInfos = getChildCategory(categories, categoryID);
  const isChildCategory = childCategoryInfos ? true : false;

  if (isChildCategory) {
    console.log("Child Category Infos =>", childCategoryInfos);
    insertChildCategories(childCategoryInfos);
  } else {
    handelSubParentCategory(categories, categoryID);
  }
};

const handelMainCategories = (categories, categoryID) => {
  const categoryInfos = getCategory(categories, categoryID);
  const isMainCategory = categoryInfos ? true : false;
  
  if (isMainCategory) {
    console.log("Category Infos =>", categoryInfos);
    insertChildCategories(categoryInfos);
  }else {
    handelChildCategories(categories, categoryID)
  }
}
window.categoryClickHandler = categoryClickHandler;
window.backToAllCategories = backToAllCategories;
export {
  getPosts,
  insertPosts,
  getCategories,
  insertMainCategories,
  handelMainCategories
};
