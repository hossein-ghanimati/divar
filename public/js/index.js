import {
  getAllCities,
  insertPopularCities,
  searchCities,
  insertSearchedCities,} from "../../utils/cities.js";

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\
const cities = await getAllCities();

/////////////////       Functions       \\\\\\\\\\\\\\\\\\\\
const renderPopularCities = () => {
  const popularCities = cities.filter((city) => city.popular);
  console.log("Popular Cities => ", popularCities);

  insertPopularCities(popularCities);
};

const renderCitiesSearching = () => {
  const searchedCitiesContainer = document.querySelector(
    ".search-result-cities"
  );
  const searchCitiesInput = document.querySelector("#search-input");

  searchCitiesInput.addEventListener("keyup", (e) => {
    searchedCitiesContainer.innerHTML = "";
    const searchedValue = e.target.value.trim();

    if (searchedValue.length) {
      searchedCitiesContainer.classList.add("active");
      const searchedCities = searchCities(cities, searchedValue);
      insertSearchedCities(searchedCities);
    } else {
      searchedCitiesContainer.classList.remove("active");
    }
  });
};

/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\\
console.log("All Cities =>", cities);

renderCitiesSearching()
renderPopularCities();
