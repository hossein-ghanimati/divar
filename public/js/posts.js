import { getPosts, insertPosts, getCategories, insertCategories} from "../../utils/posts.js";
import { hideLoader } from "../../utils/shared.js";

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\


/////////////////       Functions       \\\\\\\\\\\\\\\\\\\
const renderPosts = async () => {
  const posts = await getPosts()
  console.log("Posts =>", posts);

  insertPosts(posts)
}

const renderCategories = async () => {
  const categories = await getCategories();
  console.log("Categories =>", categories);
  
  insertCategories(categories)
}


const pageFuncsHandler = async () => {
  renderCategories()
  await renderPosts()
}
/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
window.addEventListener('load', async () => {
  await pageFuncsHandler();
  hideLoader();
})

