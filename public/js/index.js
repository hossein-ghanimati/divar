import { getAllCities, insertPopularCities } from "../../utils/cities.js"

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\
const cities = await getAllCities()

/////////////////       Functions       \\\\\\\\\\\\\\\\\\\\
const renderPopularCities = () => {
  const popularCities = cities.filter(city => city.popular)
  console.log(popularCities);
  insertPopularCities(popularCities)
}

/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\\
console.log("All Cities =>", cities);

renderPopularCities()