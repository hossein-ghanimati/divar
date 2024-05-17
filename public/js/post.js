import { getPostInfo, insertBreadCrumb, insertFields,handelNote ,handelReactions, handelBookmark, handelPicsSliders } from "../../utils/post.js";
import { calculateRelativeTimeDifference, hideElem, hideLoader, showSwal } from "../../utils/shared.js";


/////////////////       Variabels       \\\\\\\\\\\\\\\\\\\
/////////////////       Functions       \\\\\\\\\\\\\\\\\\\

const renderPostInfo = async () => {
  const post = await getPostInfo();
  console.log("Post =>", post);

  insertBreadCrumb(post)

  const postTitleElem = document.querySelector('#post-title')
  postTitleElem.innerHTML = post.title;

  const postDescriptionElem = document.querySelector('#post-description')
  postDescriptionElem.innerHTML = post.description;

  const date = calculateRelativeTimeDifference(post.createdAt)
  const dateElem = document.querySelector('#post-location')
  dateElem.innerHTML = `${date} در ${post.city.name}، ${post.neighborhood ? post.neighborhood.name : ''}`;

  const shareBtn = document.querySelector('#share-icon')
  shareBtn.addEventListener('click', () => {
    navigator?.share(location.href);
  })

  const phoneInfoBtn = document.querySelector('#phone-info-btn')
  phoneInfoBtn.addEventListener('click', () => {
    showSwal('اطلاعات تماس:', post.creator.phone,null, "تماس گرفتن", (result) =>  {
      if (!result) return false
      alert(post.creator.phone)
    })
  })

  if (post.pics.length) {
    handelPicsSliders(post.pics)
  }else{
    hideElem(document.querySelector('#post-preview'))
  }

  insertFields(post)

  handelNote(post.note)
  handelBookmark(post.bookmarked)
  handelReactions();

}

const pageFuncsHandler = async () => {
  await renderPostInfo()
}

/////////////////       Events / Codes       \\\\\\\\\\\\\\\\\\\
window.addEventListener("DOMContentLoaded", async () => {
  if (!location.pathname.endsWith('post.html')) return false
  await pageFuncsHandler();
  hideLoader();
});