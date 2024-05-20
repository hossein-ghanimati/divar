import { getUrlParam, removeUrlParam, renderPagination } from "../../../utils/shared.js"
import { getBookmarksData, generateBookmarkTemplate } from "../../../utils/userPanel/bookmarks.js"

const renderBookmarks = async () => {
  const bookmarksContainer = document.querySelector('#posts-container')
  bookmarksContainer.innerHTML = ''
  const emptyEl = document.querySelector('.empty')
  const paginationWrapper = document.querySelector('#pagination')
  const bookmarksData = await getBookmarksData()
  const bookmarks = bookmarksData.posts

  const staticHref = location.href
  const word = '.html'
  const index = staticHref.indexOf(word)
  const href = staticHref.slice(0, index + word.length)

  renderPagination(
   bookmarksData.pagination.totalPages,
   bookmarksData.pagination.page
  )

  if (bookmarks?.length) {
    bookmarks.forEach(bookmark => {
      bookmarksContainer.insertAdjacentHTML('beforeend', generateBookmarkTemplate(bookmark))
    });
  }else if (+ getUrlParam('page') > 1){
    removeUrlParam('page')
  }else{
    emptyEl.style.display = "flex"
  }
}




renderBookmarks()

export{
  renderBookmarks
}