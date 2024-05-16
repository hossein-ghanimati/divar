import { checkLogin, getUrlParam, hideElem, mainURL, showElem, showModal } from "./shared.js"
const loginModal = document.querySelector('#login-modal')

const getPostInfo = async () => {
  const postID = getUrlParam('id')
  const getReq = await fetch(`${mainURL}/post/${postID}`)
  const response = await getReq.json()
  return response.data.post
}

const insertBreadCrumb = post => {
  const breadCrumbContainer = document.querySelector('#breadcrumb')

  breadCrumbContainer.innerHTML = `
      <li class="main__breadcrumb-item">
        <a href='/pages/posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
        <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
      </li>

      <li class="main__breadcrumb-item">
        <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
        <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
      </li>

      <li class="main__breadcrumb-item">
        <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
        <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
      </li>

      <li class="main__breadcrumb-item">${post.title}</li>
    `
}

const generateFieldTemplate = field => `
  <li class="post__info-item">
    <span class="post__info-key">${field.name}</span>
    <span class="post__info-value">${field.data === false ? 'ندارد' : field.data}</span>
  </li>
`

const insertFields = post =>{
  const fieldsContainer  = document.querySelector('#post-infoes-list')
  fieldsContainer.insertAdjacentHTML('beforeend', generateFieldTemplate({name: "قیمت", data: post.price.toLocaleString()}))

  post.dynamicFields.forEach(field => 
    fieldsContainer.insertAdjacentHTML('beforeend', generateFieldTemplate(field))
  );
}

const handelNote = () => {
  const noteContainer = document.querySelector('.note')
  const noteInput = document.querySelector('#note-textarea')
  const noteTrashBtn = document.querySelector('#note-trash-icon')
  
  noteInput.addEventListener('keyup', e => {
    const value = e.target.value.trim();
    const isLogin = checkLogin()

    if (isLogin) {
      if (value) {
        showElem(noteTrashBtn)
      }else{
        hideElem(noteTrashBtn)
      }
    }else{
      e.target.value = ''
      showModal('#login-modal', 'login-modal--active')
    }
  })
  
  noteTrashBtn.addEventListener('click', () =>{
    hideElem(noteTrashBtn)
    noteInput.value = ''
  })

  noteContainer.addEventListener('mouseleave', () => {
    const value = noteInput.value;
    if (value) {
      alert(value)
    }
  })

  // noteContainer.addEventListener('mo')

}

const handelReactions = () => {
  const reActions = document.querySelectorAll('.post_feedback_icon')

  reActions.forEach(reAction => {
    reAction.addEventListener('click', () => {
      const isLogin = checkLogin()

      reActions.forEach(reAct => reAct.classList.remove('active'))

      if (isLogin) {
        reAction.classList.add('active')
      }else{
        showModal('#login-modal', 'login-modal--active')
      }
    })
  })
}


export {
  getPostInfo,
  insertBreadCrumb,
  insertFields,
  handelNote,
  handelReactions
}