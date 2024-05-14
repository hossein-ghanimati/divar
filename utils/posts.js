import {
  getFromLocal,
  mainURL,
  coverURL,
  setParamToUrl,
  calculateRelativeTimeDifference,
  getUrlParam,
  removeUrlParam,
  setIntoLocal,
} from "./shared.js";

const generateGetPostUrl = () => {
  const categoryID = getUrlParam("categoryID");
  const searchedValue = getUrlParam("searched");
  const userCities = getFromLocal("cities");
  const userCitiesIDs = userCities?.length && userCities?.map((city) => city.id)?.join("|") || 301;

  let url = `${mainURL}/post/?city=${userCitiesIDs}`;

  if (categoryID) {
    url += `&categoryId=${categoryID}`;
  }
  if (searchedValue) {
    url += `&search=${searchedValue}`;
  }

  return url;
};

let dynamicFilters = {};

let mainPosts = null;
let backupPosts = null;
const getPosts = async () => {
  const url = generateGetPostUrl();

  const getPostsReq = await fetch(url);
  const response = await getPostsReq.json();
  backupPosts = response.data.posts;
  mainPosts = response.data.posts;
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
  postsContainer.innerHTML = "";

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

const getSubCategory = (categories, categoryID) => {
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

  const subCategory = childCategory.subCategories.find(
    (subCategory) => subCategory._id == categoryID
  );

  return subCategory;
};

const handelSubParentCategory = (categories, categoryID) => {
  const subCategory = getSubCategory(categories, categoryID);
  const subParentCategory = getChildCategory(categories, subCategory.parent);

  insertChildCategories(subParentCategory);
  setIntoLocal("category", subCategory);

  console.log("Sub Category Infos =>", subCategory);
};

const handelChildCategories = (categories, categoryID) => {
  const childCategoryInfos = getChildCategory(categories, categoryID);
  const isChildCategory = childCategoryInfos ? true : false;

  if (isChildCategory) {
    insertChildCategories(childCategoryInfos);
    setIntoLocal("category", childCategoryInfos);

    console.log("Child Category Infos =>", childCategoryInfos);
  } else {
    handelSubParentCategory(categories, categoryID);
  }
};

const handelMainCategories = (categories, categoryID) => {
  const categoryInfos = getCategory(categories, categoryID);
  const isMainCategory = categoryInfos ? true : false;

  if (isMainCategory) {
    insertChildCategories(categoryInfos);
    setIntoLocal("category", categoryInfos);

    console.log("Category Infos =>", categoryInfos);
  } else {
    handelChildCategories(categories, categoryID);
  }
};

const generateCheckboxFilterTemplate = (filter) => {
  return `
  <div class="sidebar__filter">
    <label class="switch">
      <input class="icon-controll filter" type="checkbox" />
      <span class="slider round"></span>
    </label>
    <p>${filter.name}</p>
  </div>
  `;
};
const generateSelectboxFilterTemplate = (filter) => {
  return `
    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#accordion-${filter.slug}"
            aria-expanded="false"
            aria-controls="accordion-${filter.name}"
          >
            <span class="sidebar__filter-title">${filter.name}</span>
          </button>
        </h2>
        <div
          id="accordion-${filter.slug}"
          class="accordion-collapse collapse"
          aria-labelledby="accordion-${filter.name}"
          data-bs-parent="#accordionFlushExample"
        >
          <div class="accordion-body">
            <select class="selectbox" onchange="dynamicSelectFiltersApplyHandler(event.target.value, '${filter.slug}')">
              <option value='default'>پیش فرض</option>
              ${filter.options
                .sort((a, b) => b - a)
                .map(
                  (option) => `<option value='${option}'>${option}</option>`
                )}
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
};

const insertFilters = filters => {
  const filtersConstainer = document.querySelector("#sidebar-filters .dynamics");
  filtersConstainer.innerHTML = ''

  filters.forEach((filter) => {
    if (filter.type == "checkbox") {
      filtersConstainer.insertAdjacentHTML(
        "afterbegin",
        generateCheckboxFilterTemplate(filter)
      );
    } else if (filter.type == "selectbox") {
      filtersConstainer.insertAdjacentHTML(
        "afterbegin",
        generateSelectboxFilterTemplate(filter)
      );
    }
  });
};

const filterByJustPic = posts => {
  const justPhotoController = document.querySelector("#just_photo_controll");
  let filteredPosts = [...posts]
  if (justPhotoController.checked) {
    filteredPosts = posts.filter((post) => post.pics.length);
  }

  return filteredPosts
};

const filterByExcheng = posts => {
  const exchangeController = document.querySelector("#exchange_controll");
  let filteredPosts = [...posts]

  if (exchangeController.checked) {
    filteredPosts = posts.filter((post) => post.exchange);
  }

  return filteredPosts
}

const filterByMinMaxPrice = posts => {
  const minPrice = document.querySelector('#min-price-selectbox').value
  const maxPrice = document.querySelector('#max-price-selectbox').value
  let filteredPosts = [...posts]

  if (minPrice != "default") {
    if (maxPrice != "default") {
      // Min And Max Price Filtering
      filteredPosts = filteredPosts.filter(post => post.price >= minPrice && post.price <= maxPrice)
    }else{
      // Min Price Filtering
      filteredPosts = filteredPosts.filter(post => post.price >= minPrice)
    }
  }else{
    if (maxPrice != "default") {
      // Max Price Filtering
      filteredPosts = filteredPosts.filter(post => post.price <= maxPrice)
    }
  }

  return filteredPosts
}

const filterByDynamicFileds = posts => {
  let filteredPosts = [...posts];

  for (const slug in dynamicFilters) {
    if (dynamicFilters[slug] == "default") continue
    filteredPosts = filteredPosts.filter(post => {
      return post.dynamicFields.some(field => {
      
        return field.slug == slug && field.data == dynamicFilters[slug]
      })
    })
    
  }
  return filteredPosts
}

const applyAllFilterings = () => {
  let filteredPosts = [...backupPosts];
  
  filteredPosts = filterByJustPic(filteredPosts);
  filteredPosts = filterByExcheng(filteredPosts);
  filteredPosts = filterByMinMaxPrice(filteredPosts);
  filteredPosts = filterByDynamicFileds(filteredPosts)
  
  return filteredPosts
};

const staticCheckFiltersApplyHandler = () => {
  const staticCheckControllers = document.querySelectorAll(
    ".static-check-controller"
  );
  
  staticCheckControllers.forEach((controller) => {
    controller.addEventListener("change", () => {

      const filteredPosts = applyAllFilterings()    
      insertPosts(filteredPosts);
    });
  });
};

const staticSelectFiltersApplyHandler = () => {
  const staticSelectors = document.querySelectorAll(".static-selector");

  staticSelectors.forEach(selector => {
    selector.addEventListener("change", () => {

      const filteredPosts = applyAllFilterings()
      insertPosts(filteredPosts);
    })
  })
};

const dynamicSelectFiltersApplyHandler = (value, slug) => {
  dynamicFilters[slug] = value;



  const filteredPosts = applyAllFilterings()
  insertPosts(filteredPosts)
};

const dynamicCheckFiltersApplyHandler = () => {};

window.categoryClickHandler = categoryClickHandler;
window.backToAllCategories = backToAllCategories;
window.dynamicSelectFiltersApplyHandler = dynamicSelectFiltersApplyHandler
export {
  getPosts,
  insertPosts,
  getCategories,
  insertMainCategories,
  handelMainCategories,
  insertFilters,
  staticCheckFiltersApplyHandler,
  staticSelectFiltersApplyHandler,
  dynamicCheckFiltersApplyHandler,
  categoryClickHandler
};
