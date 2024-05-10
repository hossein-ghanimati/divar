import {
  getAllCities,
  insertPopularCities,
  searchCities,
  insertSearchedCities,
} from "../../utils/cities.js";
import { getFromLocal, hideLoader } from "../../utils/shared.js";
import { getAllSocials, insertSocials } from "../../utils/shared-app/socials.js";

// /////////////////       Variavles       \\\\\\\\\\\\\\\\\\\

// /////////////////       Functions       \\\\\\\\\\\\\\\\\\\\
const renderPopularCities = cities => {
  const popularCities = cities.filter((city) => city.popular);
  console.log("Popular Cities => ", popularCities);

  insertPopularCities(popularCities);
};

const renderCitiesSearching = cities => {
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

const renderSocials = async () => {
  const socials = await getAllSocials();
  console.log("Socials =>", socials);

  insertSocials(socials)
}

const pageFuncsHandler = async () => {
  const cities = await getAllCities();
  console.log("All Cities =>", cities);

  renderSocials()
  renderPopularCities(cities);
  renderCitiesSearching(cities);
};

/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\\

window.addEventListener("load", async () => {
  const selectedCities = getFromLocal('cities');
  
  if (selectedCities?.length) {
    location.href = './pages/posts.html'
  }
  await pageFuncsHandler()
  hideLoader();
});

