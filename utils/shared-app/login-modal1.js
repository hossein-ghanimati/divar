import { sendCode } from "../../public/js/auth.js";
import { renderLoginModal2 } from "./login-modal2.js";

const handelModalSubmit = () => {
  const phoneInput = document.querySelector('.phone_Number_input')
  const phoneNumberRegex = RegExp(/^9\d{9}$/);
  const submitBtn = document.querySelector('.submit_phone_number_btn')
  const loginErrorElem = document.querySelector('.step-1-login-form__error')
  const loginForm = document.querySelector('#login-modal')
  const loader = document.querySelector('#loading-container')

  submitBtn.addEventListener('click', async e =>{
    e.preventDefault();
    const phoneNumer = phoneInput.value.trim()
    const isValidPhone = phoneNumberRegex.test(phoneNumer)

    if (isValidPhone) {
      loginErrorElem.innerHTML = '';
      loader.classList.add('active-login-loader')
      const sendCodeRes = await sendCode(phoneNumer)
      loader.classList.remove('active-login-loader')
      if (sendCodeRes?.success) {
        loginForm.classList.add('active_step_2')
        renderLoginModal2(phoneNumer)
      }else{
        loginErrorElem.innerHTML = "مشکلی در اتصال به وجود آمده است"
      }
    }else{
      loginErrorElem.innerHTML = 'لطفا شماره معبتری را وارد نمایید (بدون صفر در ابتدا)'
    }
  })
}

export {
  handelModalSubmit
}