import { calculateRelativeTimeDifference, getFromSession, showElem, showSwal } from "../../../utils/shared.js";
import { verifyUser } from "../../../utils/userPanel/verify.js";
import { getMe } from "../auth.js";
const handelUserVerify = async () => {
  const verifyContainer = document.querySelector('#verify-container');
  const userInfo = getFromSession('divar-user') || await getMe()
  if (userInfo.verified) {
    const date = calculateRelativeTimeDifference(userInfo.updatedAt)
    verifyContainer.innerHTML = `
      <div class="verified">
        <p>تأیید هویت شده</p>
        <span>تأیید هویت شما در ${date} از طریق کد ملی انجام شد.</span>
        <i class="sidebar__menu-icon bi bi-patch-check verify-icon"></i>
      </div>
    `
    return true
  }

  
  const verifyInput = document.querySelector('#verify-input')
  const verifyBtn = document.querySelector('#verify-btn')
  const nationalCodeRegex = new RegExp(/^\d{10}$/)

  verifyBtn.addEventListener('click', async () => {
    const isValidCode = nationalCodeRegex.test(verifyInput.value)
    if (isValidCode) {
      const verifyReq = await verifyUser(verifyInput.value)
      if (verifyReq.status <= 200) {
        sessionStorage.removeItem('divar-user')
        handelUserVerify()
        showSwal('تایید هویت با موفقیت انجام شد', null, 'success', "باشه", ()=> null)
        return true
      }else{
      }
    }
    showSwal('کدملی معتبر نیست', null, 'error', "باشه", ()=> null)
  })
}

handelUserVerify()