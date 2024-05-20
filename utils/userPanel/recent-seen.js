import { renderRecentSeens } from "../../public/js/userPanel/recent-seen.js"
import { calculateRelativeTimeDifference, getFromLocal, getUrlParam, mainURL, coverURL, showSwal, getFromSession, setIntoSession } from "../shared.js"

const getPost = async postID => {
  const getReq =  await fetch(`${mainURL}/post/${postID}`)
  const response = await getReq.json()
  return response.data.post
}

const generatePostTemplate = post => {
  const date = calculateRelativeTimeDifference(post.createdAt)
  return `
  <div class="post" id="${post._id}">
      <div>
      ${
        post.pics.length
          ? `<img src="${coverURL}/${post.pics[0].path}" />`
          : `<img src="../../public/images/main/noPicture.PNG" />`
      }
      
      <div>
          <a class="title" href="/pages/post.html?id=${post._id}">${
    post.title
    }</a>
            <p>${date} در ${post.city.name}، ${
    post.neighborhood.id !== 0 ? post.neighborhood.name : ""
    }</p>
        </div>
        </div>
        <i onclick="sahrePost('${post._id}', '${
    post.title
    }')" class="bi bi-share"></i>
        <i onclick="removeRecentSeen('${
          post._id
        }')" class="bi bi-trash"></i>
  </div>      
`
}



const insertPosts = posts => {
  const postsContainer = document.querySelector('#posts-container')
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    postsContainer.insertAdjacentHTML('beforeend', generatePostTemplate(post))
  });
}

window.sahrePost = (id) => {
  let word = "pages/"
  let href = location.href
  let wordIndex = href.indexOf(word)

  let url = href.slice(0, wordIndex + word.length)
  let postUrl = url+`post.html?id=${id}`
  navigator.clipboard.writeText(postUrl)
  showSwal('لینک آگهی کپی شد..', null, "success", 'باشه', () => null)
}

window.removeRecentSeen = postID => {
  let recents = getFromSession('divar-recent-seens')
  recents = recents.filter(recent => !(recent == postID))
  setIntoSession('divar-recent-seens', recents)
  document.getElementById(postID).remove()
  if (!recents.length) renderRecentSeens()
}

export{
  getPost,
  insertPosts
}
