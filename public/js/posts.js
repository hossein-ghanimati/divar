import { getPosts, insertPosts, getCategories, insertCategories} from "../../utils/posts.js";

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

/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
renderPosts()

renderCategories()