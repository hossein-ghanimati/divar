import { getUrlParam, removeUrlParam, renderPagination } from "../../../utils/shared.js";
import { generateNoteTemplate, getNotesData } from "../../../utils/userPanel/notes.js";

const renderNotes = async () => {
  const notesContainer = document.querySelector('#posts-container')
  const empyContainer = document.querySelector('.empty')
  const paginationWrapper = document.querySelector('#pagination')
  
  const notesData = await getNotesData()

  renderPagination(
    notesData.pagination.totalPages,
    notesData.pagination.page
  )

  const notesPost = notesData.posts
  notesContainer.innerHTML = '';
  console.log(notesPost);
  
  if (notesPost.length) {
    notesPost.forEach(post => {
      notesContainer.insertAdjacentHTML('beforeend', generateNoteTemplate(post))
    });
  }else if (+ getUrlParam("page") > 1) {
    removeUrlParam('page')
  }else{
    empyContainer.style.display = "flex"
  }
}

renderNotes()
export{
  renderNotes
}