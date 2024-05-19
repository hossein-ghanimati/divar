import { generateBookmarkTemplate } from "../../../utils/userPanel/bookmarks.js"
import { getBookmark } from "../../../utils/userPanel/verify.js"

const renderBookmarks = async () => {
  const bookmarksContainer = document.querySelector('#posts-container')
  bookmarksContainer.innerHTML = ''
  const emptyEl = document.querySelector('.empty')
  const bookmarks = await getBookmark()

  if (bookmarks.length) {
    bookmarks.forEach(bookmark => {
      bookmarksContainer.insertAdjacentHTML('beforeend', generateBookmarkTemplate(bookmark))
    });
  }else{
    emptyEl.style.display = "flex"
  }
}




renderBookmarks()

export{
  renderBookmarks
}