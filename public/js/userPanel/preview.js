import { calculateRelativeTimeDifference, showSwal } from "../../../utils/shared.js";
import { deletePost, getPostData, renderMap, showPostFields } from "../../../utils/userPanel/preview.js";
import { insertFields} from "../../../utils/post.js"


let post = null;

const showPostPreview = async () => {
  const postData = await getPostData()
  post = postData.post
  console.log(post);
  const date = calculateRelativeTimeDifference(post.createdAt)
  
  const postTitle = document.querySelector('#post-title')
  postTitle.innerHTML = post.title

  const postCity = document.querySelector('#post-location')
  postCity.innerHTML = `${date} در ${post.city.name} ، ${post.neighborhood.name}`
  
  const postDescription = document.querySelector('#post-description')
  postDescription.innerHTML = post.description

  insertFields(post)

  renderMap(post.map)
}


const renderDeletePost = () => {
  const deleteBtn = document.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', e => {
    e.preventDefault()
    showSwal('از حذف مطمئنید؟', null, 'warning', ['خیر', 'بله'], result => {
      if (result) {
        deletePost().then(res => {
          if (res.status == 200) {
            showSwal('آگهی با موفقیت حذف شد', null, 'success', 'مشاهده آگهی ها', result => {
              if (result) {
                location.href = "./posts.html"
              }
            })
          }
        })
      }
    })
  })
} 

const renderEditPost = () => {
  showPostFields()
}



const pageFuncsHandler = async () => {
  await showPostPreview()
  renderDeletePost()
  renderEditPost()
}

pageFuncsHandler()