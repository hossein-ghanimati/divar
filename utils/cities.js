import { mainURL, setIntoLocal } from "./shared.js";
const getAllCities = async () => {
  const getReq = await fetch(`${mainURL}/location`);
  const response = await getReq.json();
  return response.data.cities;
};

const cityClickHandler = (cityName, cityID, cityProvince) => {
  setIntoLocal("cities", [{
    title : cityName,
    id : cityID,
    province_id: cityProvince
  }]);
  location.href = './pages/posts.html'
}

const generatePopularCitiyTemplate = city => {
  return `
    <li class="main__cities-item" onclick="cityClickHandler('${city.name}', ${city.id}, ${city.province_id})">
        <p class="main__cities-link">
            ${city.name}
        </p>
    </li>
  `;
};

const insertPopularCities = cities => {
  const popularCitiesContainer = document.querySelector("#popular-cities");

  cities.forEach((city) => {
    popularCitiesContainer.insertAdjacentHTML(
      "beforeend",
      generatePopularCitiyTemplate(city)
    );
  });
};

const searchCities = (cities, searchedValue) => {
  const searchedCities = cities.filter(city => city.name.includes(searchedValue))
  return searchedCities
}

const generateSearhcedCitiesTemplate = (city, status) => {
  console.log(city);
  let template = null;

  if (status.wasAny) {
    template = `
      <li onclick="cityClickHandler('${city.name}', ${city.id}, ${city.province_id})">
        ${city.name}
      </li>
    `
  }else{
    template = `
      <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" />
      <p class="empty">نتیجه‌ای برای جستجوی شما پیدا نشد.</p>
    `
  }

  return template
}

const insertSearchedCities = searchedCities => {
  const searchedCitiesContainer = document.querySelector(".search-result-cities")

  if (searchedCities.length) {
    searchedCities.forEach(city => {
      searchedCitiesContainer.insertAdjacentHTML('beforeend', generateSearhcedCitiesTemplate(city, {wasAny : true}))
    })
  }else{
    searchedCitiesContainer.insertAdjacentHTML('beforeend', generateSearhcedCitiesTemplate({name : 'شهری یافت نشد...'}, {wasAny : false}))
  }
}


window.cityClickHandler = cityClickHandler
export {
  getAllCities,
  insertPopularCities,
  searchCities,
  insertSearchedCities,
};
