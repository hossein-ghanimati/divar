import { renderNotes } from "../../public/js/userPanel/notes.js"
import { calculateRelativeTimeDifference, getToken,coverURL, mainURL, showSwal, getUrlParam } from "../shared.js"

const getNotesData = async () => {
  const page = getUrlParam('page') || 1
  const getReq = await fetch(`${mainURL}/user/notes?limit=4&page=${page}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  const response = await getReq.json()
  return response.data
}

const generateNoteTemplate = post => {
  const date = calculateRelativeTimeDifference(post.note.createdAt)

  return`
    <div class="post">
        <div>
            ${
              post.pics.length
                ? `<img src="${coverURL}/${post.pics[0].path}" />`
                : `<img src="../../public/images/main/noPicture.PNG" />`
            }
            <div>
            <a class="title" href="../post.html?id=${post._id}">${
              post.title
            }</a>
            <p>${date}</p>
            <p>${post.note.content}</p>
            </div>
        </div>
        <i class="bi bi-trash" onclick=removeNote('${post.note._id}')></i>
    </div>
  `
}

window.removeNote = noteID => {
  showSwal('آیا مایل به حذف یاددات هستید؟.', null,'warning', ['خیر','حذف یاد داشت'], async result => {
    if (result) {
      const deleteReq = await fetch(`${mainURL}/note/${noteID}`,{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })

      if (deleteReq.status <= 205) {
        renderNotes()
        showSwal('یادداشت با موفقتی حذف شد', null, 'success', 'باشه', () => null)
      }
    }
  })
}

export{
  generateNoteTemplate,
  getNotesData
}