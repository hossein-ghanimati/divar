import { getAllCities } from "../../utils/cities.js"

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\\
const popularCitiesContainer = document.querySelector('#popular-cities')
const cities = await getAllCities()

/////////////////       Functions       \\\\\\\\\\\\\\\\\\\\


/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\\
console.log(cities);