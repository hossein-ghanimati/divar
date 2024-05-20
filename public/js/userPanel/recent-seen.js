import {getFromLocal, getFromSession} from "../../../utils/shared.js"
import { getPost, insertPosts } from "../../../utils/userPanel/recent-seen.js";

const renderRecentSeens = async () => {
  const emptyContainer = document.querySelector('.empty')
  const recentPostsIDs = getFromSession('divar-recent-seens');

  const recentPosts = []
  
  if (recentPostsIDs?.length) {
    for (const postID of recentPostsIDs) {
      const post = await getPost(postID);
      recentPosts.push(post);
    }
    insertPosts(recentPosts)
  }else{
    emptyContainer.style.display = "flex"
  }
} 

renderRecentSeens()

export{
  renderRecentSeens
}