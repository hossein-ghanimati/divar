import { getPosts, insertPosts } from "../../utils/posts.js";

/////////////////       Variavles       \\\\\\\\\\\\\\\\\\\
const posts = await getPosts()


/////////////////       Functions       \\\\\\\\\\\\\\\\\\\
const renderPosts = () => {
  insertPosts(posts)
}

/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
renderPosts()