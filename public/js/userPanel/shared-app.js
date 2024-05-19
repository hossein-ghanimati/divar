import{checkLogin, getFromSession, hideLoader} from "../../../utils/shared.js"
import { logoutHandler } from "../shared-app.js"

const renderFuncs = async ()  => {
  const isLogin = await checkLogin()
  const userInfo = getFromSession('divar-user')
  if (!isLogin) {
    location.href = '../../index.html'
    return false
  }

  hideLoader()

  const phoneEl = document.querySelector('#sidebar-phone-number')
  phoneEl.innerHTML = userInfo.phone

  const logoutBtn = document.querySelector('#logout-btn')
  logoutBtn.addEventListener('click', () => {
    logoutHandler()
  })
}

renderFuncs()