import { mainURL } from "./shared.js";
const getAllCities = async () => {
  const getReq = await fetch(`${mainURL}/location`);
  const response = await getReq.json();
  return response.data.cities;
};

const generatePopularCitiyTemplate = city => {
  return `
    <li class="main__cities-item">
        <p class="main__cities-link">
            ${city.name}
        </p>
    </li>
  `;
};

const insertPopularCities = cities => {
  const popularCitiesContainer = document.querySelector("#popular-cities");

  cities.forEach(city => {
    popularCitiesContainer.insertAdjacentHTML(
      "beforeend",
      generatePopularCitiyTemplate(city)
    );
  });
};

export { getAllCities, insertPopularCities };
