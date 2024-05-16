import { sendCode, verifyUser } from "../../public/js/auth.js"
import { hideElem, hideModal, setIntoLocal, showElem, showSwal } from "../shared.js"
const reSendCodeBtn = document.querySelector('.req_new_code_btn')
const timerWrapper = document.querySelector('.request_timer')
const changeNumberBtn = document.querySelector('.login-change-number')
const closeModalBtn = document.querySelectorAll('.login-modal__header-btn')[1]
const otpInput = document.querySelector('.code_input')
const phoneElem = document.querySelector('.user_number_notice')
const modalError = document.querySelector('.step-2-login-form__error')
const loader = document.querySelector('#loading-container')


const setTimer = () => {
  const timerElem = document.querySelector('.request_timer span')
  let counter = 60;
  timerElem.innerText = counter

  const timerInterval = setInterval(() => {
    if (counter <= 1) {
      clearInterval(timerInterval)
      showElem(reSendCodeBtn)
      hideElem(timerWrapper)
    }

    counter --;
    timerElem.innerText = counter;
  }, 1000)

  changeNumberBtn.onclick = () => {
    hideModal('#login-modal', 'active_step_2')
    clearInterval(timerInterval)
  }

  closeModalBtn.onclick = () => {
    hideModal('#login-modal', 'login-modal--active')
  }
}

const handelTimer = () => {
  hideElem(reSendCodeBtn)
  showElem(timerWrapper, 'flex')

  setTimer()
}

const renderLoginModal2 = phoneNumber => {
  phoneElem.innerText = '0'+phoneNumber

  handelTimer()

  reSendCodeBtn.onclick = async () => {
    const sendRespone = await sendCode(phoneNumber)
    if (sendRespone.success) {
      renderLoginModal2(phoneNumber)
    }
  }

  
}

const verifyBtn = document.querySelector('.login_btn')
verifyBtn.addEventListener('click', async () => {
  const phoneNumber = phoneElem.innerText.trim()
  const otpCode = otpInput.value.trim()
  const otpRegex = RegExp(/^\d{4}$/)
  const isValidOtp = otpRegex.test(otpCode)

  if (isValidOtp) {
    modalError.innerHTML = ''
    loader.classList.add('active-login-loader')
    const verifyResponse = await verifyUser(phoneNumber, otpCode)
    loader.classList.remove('active-login-loader')
    console.log(verifyResponse);
    if (verifyResponse.success) {
      setIntoLocal('divar-token', verifyResponse.data.token)
      hideModal('#login-modal', 'login-modal--active')
      showSwal('ورود با موفقیت انجام شد', 'آیا به پنل کاربری ورود میکنید ؟', 'success', 'ورود به پنل', result => {
        if (result) {
          location.href = './userPanel/verify.html'
        }else{
          location.reload()
        }
      })
    }else{
      modalError.innerHTML = 'کد وارد شده اشتباه است.'
    }
  }else{
    modalError.innerHTML = 'کد معتبری وارد کنید..'
  }
})



export {
  renderLoginModal2
}