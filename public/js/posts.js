import { getPosts, insertPosts, getCategories, insertCategories} from "../../utils/posts.js";

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\


/////////////////       Functions       \\\\\\\\\\\\\\\\\\\
const renderPosts = async () => {
  const posts = await getPosts()
  insertPosts(posts)
}

const renderCategories = async () => {
  const categories = await getCategories();
  insertCategories(categories)
}

/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
renderPosts()

renderCategories()