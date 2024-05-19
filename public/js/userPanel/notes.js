import { generateNoteTemplate, getNotes } from "../../../utils/userPanel/notes.js";

const renderNotes = async () => {
  const notesContainer = document.querySelector('#posts-container')
  const empyContainer = document.querySelector('.empty')
  
  const notesPost = await getNotes()
  notesContainer.innerHTML = '';
  console.log(notesPost);
  
  if (notesPost.length) {
    notesPost.forEach(post => {
      notesContainer.insertAdjacentHTML('beforeend', generateNoteTemplate(post))
    });
  }else{
    empyContainer.style.display = "flex"
  }
}

renderNotes()
export{
  renderNotes
}