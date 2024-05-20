import { checkLogin,  getFromLocal, renderPagination } from "../../../utils/shared.js";
import { getAllSocials, insertSocials } from "../../../utils/shared-app/socials.js";
import { getMe } from "../auth.js";
import { generatePostTemplate, getPostsData } from "../../../utils/userPanel/posts.js";

const renderUserPosts = async () => {
  const postsData = await getPostsData()
  console.log(postsData);
  const postsContainer = document.querySelector('#posts-container');
  const posts = postsData.posts

  renderPagination(
   postsData.pagination.tottalPages, 
   postsData.pagination.page
  )

  posts.forEach(post => {
    postsContainer.insertAdjacentHTML('beforeend', generatePostTemplate(post))
  })

}

const renderPanelLinks = async () => {
  const panelLinksBtn = document.querySelector('.dropdown-toggle')
  const panelLinksContainer = document.querySelector('.header_dropdown_menu')
  if (!panelLinksContainer) return false;
  const locationPath = location.pathname
  const isLogin = await checkLogin()
  const user = getFromLocal('divar-user') || await getMe()
  const linksTemplate = 
    isLogin ?
      `
        <li class="header__left-dropdown-item header_dropdown-item_account">
          <a
            href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/posts.html"
            class="header__left-dropdown-link login_dropdown_link"
          >
            <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
            <div>
              <span>کاربر دیوار </span>
              <p>تلفن ${user.phone}</p>
            </div>
          </a>
        </li>
        <li class="header__left-dropdown-item">
          <a class="header__left-dropdown-link" href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/verify.html">
            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
            تایید هویت
          </a>
        </li>
        <li class="header__left-dropdown-item">
          <a class="header__left-dropdown-link" href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/bookmarks.html">
            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
            نشان ها
          </a>
        </li>
        <li class="header__left-dropdown-item">
          <a class="header__left-dropdown-link" href="${locationPath.includes('userPanel') ? '../' : './'}userPanel/notes.html">
            <i class="header__left-dropdown-icon bi bi-journal"></i>
            یادداشت ها
          </a>
        </li>
        <li class="header__left-dropdown-item logout-link" id="login_out" onclick="logoutHandler()">
          <p class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-shop"></i>
            خروج
          </p>
        </li>
      `
    :
      `
        <li class="header__left-dropdown-item">
          <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
            <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
            ورود
          </span>
        </li>
        <li class="header__left-dropdown-item">
          <div class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
            نشان ها
          </div>
        </li>
        <li class="header__left-dropdown-item">
          <div class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-journal"></i>
            یادداشت ها
          </div>
        </li>
        <li class="header__left-dropdown-item">
          <div class="header__left-dropdown-link" href="#">
            <i class="header__left-dropdown-icon bi bi-clock-history"></i>
            بازدید های اخیر
          </div>
        </li>
      `

  panelLinksContainer.insertAdjacentHTML('beforeend', linksTemplate)

  if (!isLogin) {
    panelLinksContainer.addEventListener('click', () => {
      showModal('#login-modal', 'login-modal--active')
    })
  }
}

const renderSocials = async () => {
  const socials = await getAllSocials();
  console.log("Socials =>", socials);

  insertSocials(socials)
}
renderUserPosts()

renderPanelLinks()
renderSocials()