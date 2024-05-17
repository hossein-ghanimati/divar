import { checkLogin, coverURL, getToken, getUrlParam, hideElem, mainURL, showElem, showModal, showSwal } from "./shared.js"
const loginModal = document.querySelector('#login-modal')
const noteInput = document.querySelector('#note-textarea')
let noteFirstValue = null;
let isApplyed = null;
let isBookmarked = null;
let noteID = null;

const createReqBody = () => {
    const token = getToken()

    if (token) {
      return {
        method: 'GET',
        headers:{
          Authorization : token ? `Bearer ${token}` : null
        }
      }

    }else{
      return {
        method: 'GET'
      }
    }
}

const getPostInfo = async () => {
  const postID = getUrlParam('id')
  
  
  const reqBody = createReqBody()

  const getReq = await fetch(`${mainURL}/post/${postID}`, reqBody)
  const response = await getReq.json()
  return response.data.post
}

const insertBreadCrumb = post => {
  const breadCrumbContainer = document.querySelector('#breadcrumb')

  breadCrumbContainer.innerHTML = `
      <li class="main__breadcrumb-item">
        <a href='./posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
        <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
      </li>

      <li class="main__breadcrumb-item">
        <a href='./posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
        <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
      </li>

      <li class="main__breadcrumb-item">
        <a href='./posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
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

const applyNote = async () => {
  const noteData = {
    postId : getUrlParam('id'),
    content: noteInput.value.trim()
  }
  const applyReq = await fetch(`${mainURL}/note`, {
    method: 'POST',
    headers:{
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(noteData)
  })
  const response = await applyReq.json()

  if (applyReq.success || applyReq.ok) {
    noteFirstValue = noteData.content
    isApplyed = true
    noteID = response.data.note._id
  }
}

const editNote = async () =>{
  const noteData = {
    postId : getUrlParam('id'),
    content: noteInput.value.trim()
  }

  const editReq = await fetch(`${mainURL}/note/${noteID}`, {
    method: 'PUT',
    headers:{
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(noteData)
  })

  if (editReq.success || editReq.ok) {
    noteFirstValue = noteData.content
  }
}

const deleteNote = () =>{
  showSwal('آیا مایل به حذف یاددات هستید؟.', null,'warning', 'حذف یاد داشت', async result => {
    if (result) {
      const deleteReq = await fetch(`${mainURL}/note/${noteID}`,{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })

      if (deleteReq.success || deleteReq.ok) {
        noteFirstValue = ''
        isApplyed = false
      }
    }else{
      noteInput.value = noteFirstValue
    }
  })
}
const noteContainerMouseLeaveHandler = note => {
  const value = noteInput.value;
  if (isApplyed && !(value == noteFirstValue) ) {
    if (value) {
      console.log("Editing Note..");
      editNote(note._id)
    }else{
      console.log("Deleting Note..");
      deleteNote(note._id)
    }
    return false
  }

  if (value && !(value == noteFirstValue)) {
    console.log("Setting Note...");
    applyNote(0)

  }
}

const handelNote = (note) => {
  const noteContainer = document.querySelector('.note')
  const noteTrashBtn = document.querySelector('#note-trash-icon')
  
  if (note) {
    noteFirstValue = note.content
    noteInput.value = note.content
    isApplyed = true
    console.log(note);
    noteID = note._id
  }
  
  noteInput.addEventListener('keyup', async e => {
    const value = e.target.value.trim();
    const isLogin = await checkLogin()

    if (isLogin) {
      if (value) {
        showElem(noteTrashBtn)
      }else{
        hideElem(noteTrashBtn)
      }
    }else{
      e.target.value = ''
      showModal('#login-modal', 'login-modal--active')
      
      noteContainer.removeEventListener('mouseleave', noteContainerMouseLeaveHandler)
    }
  })
  
  noteTrashBtn.addEventListener('click', () =>{
    hideElem(noteTrashBtn)
    noteInput.value = ''
  })

  

  noteContainer.addEventListener('mouseleave', () => {
    noteContainerMouseLeaveHandler(note)
  })

  // noteContainer.addEventListener('mo')

}

const deleteBookmark = async () => {
  const postID = getUrlParam('id')
  const deleteReq = await fetch(`${mainURL}/bookmark/${postID}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  if (deleteReq.status == 200) {
    handelBookmark(false)
  }
}

const applyBookmark = async () => {
  const postID = getUrlParam('id')
  const deleteReq = await fetch(`${mainURL}/bookmark/${postID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  if (deleteReq.status == 201) {
    handelBookmark(true)
  }
}

const showLoginModal = () => {
  showModal('#login-modal', 'login-modal--active')
}

const handelBookmark = async bookmarked => {
  isBookmarked = bookmarked;
  const bookmarkIcon = document.querySelector('#bookmark-icon-btn .bi.bi-bookmark')
  const isLogin = await checkLogin()
  let bookmarkClickHandler = null;
  if (!isLogin) {
    bookmarkClickHandler = showLoginModal
    bookmarkIcon.onclick = bookmarkClickHandler
    return false
  }
  
  if (isBookmarked) {
    bookmarkIcon.style.color = "red"
    bookmarkClickHandler = deleteBookmark
  }else{
    bookmarkIcon.style.color = "gray"
    bookmarkClickHandler = applyBookmark
  }

  bookmarkIcon.onclick = bookmarkClickHandler
}

const handelReactions = () => {
  const reActions = document.querySelectorAll('.post_feedback_icon')

  reActions.forEach(reAction => {
    reAction.addEventListener('click', async () => {
      const isLogin = await checkLogin()

      reActions.forEach(reAct => reAct.classList.remove('active'))

      if (isLogin) {
        reAction.classList.add('active')
      }else{
        showModal('#login-modal', 'login-modal--active')
      }
    })
  })
}

const generatePicSlidTemplate = pic => `
 <div class="swiper-slide">
  <img src="${coverURL}/${pic.path}"/>
 </div>
`

const handelPicsSliders = pics => {
  const mainSlider = document.querySelector('#main-slider-wrapper')
  const secondSlider = document.querySelector('#secend-slider-wrapper')

  pics.forEach(pic => {
    mainSlider.insertAdjacentHTML('beforeend', generatePicSlidTemplate(pic))
    secondSlider.insertAdjacentHTML('beforeend', generatePicSlidTemplate(pic))
  })

  const secondSliderConfig = new Swiper('.mySwiper', {
    spaceBetween: 10,
    rewind: true,
    slidesPerView: 4,
    freeMode: true,
    whatchSlidesProgress: true,
  })

  const mainSliderConfig = new Swiper('.mySwiper2', {
    spaceBetween: 10,
    rewind: true,
    
    navigation:{
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    thumbs:{
      swiper: secondSliderConfig
    }
  })
}


export {
  getPostInfo,
  insertBreadCrumb,
  insertFields,
  handelNote,
  handelBookmark,
  handelReactions,
  handelPicsSliders
}