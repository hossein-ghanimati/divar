import { renderBookmarks } from "../../public/js/userPanel/bookmarks.js"
import { calculateRelativeTimeDifference, coverURL, getToken, mainURL, showSwal } from "../shared.js"

const generateBookmarkTemplate = bookmark => {
  const date = calculateRelativeTimeDifference(bookmark.createdAt)
  return `
    <div class="post">
        <div>
            <div>
            <a class="title" href="../post.html?id=${bookmark._id}">${
              bookmark.title
            }</a>
            <div>
                <p>${bookmark.price.toLocaleString()} تومان</p>
                <p>${date} در ${bookmark.city.name} ، ${bookmark.neighborhood.name}</p>
            </div>
            </div>
            ${
              bookmark.pics.length
                ? `<img src="${coverURL}/${bookmark.pics[0].path}" />`
                : `<img src="../../public/images/main/noPicture.PNG" />`
            }
        </div>
        <div>
            <button onclick="sharePost('${bookmark._id}', '${bookmark.title}')">
            اشتراک گذاری
            <i class="bi bi-share"></i>
            </button>
            <button onclick="removeBookmark('${bookmark._id}', '${bookmark.title}')">
            حذف نشان
            <i class="bi bi-trash"></i>
            </button>
        </div>
    </div>
  `
}

window.sharePost = (id, title) => {
  let word = "pages/"
  let href = location.href
  let wordIndex = href.indexOf(word)

  let url = href.slice(0, wordIndex + word.length)
  let postUrl = url+`post.html?id=${id}`
  navigator.clipboard.writeText(postUrl)
  showSwal('لینک آگهی کپی شد..', null, "success", 'باشه', () => null)
}

window.removeBookmark =  (id, title) => {
  showSwal('آیا از حذف نشان مطمئتید ؟', null, 'warning', ['خیر', 'بله'], async result => {
    if (result) {
      const deleteReq = await fetch(`${mainURL}/bookmark/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
    
      if (deleteReq.status == 200) {
        renderBookmarks()
        showSwal(`"${title}" از نشان ها با موفقیت حذف شد.`, null, 'success', 'باشه', () => null)
      }
    }
  })
}

export{
  generateBookmarkTemplate
}