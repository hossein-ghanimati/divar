import { getToken, mainURL, setIntoSession } from "../../utils/shared.js"

const sendCode = async phone => {
  const sendReq = await fetch(`${mainURL}/auth/send`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone : '0'+phone
    })
  })
  const sendRespone = await sendReq.json()
  return sendRespone
}

const verifyUser = async (phoneNumber, otpCode) => {
  const verifyReq = await fetch(`${mainURL}/auth/verify`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone : phoneNumber,
      otp : otpCode
    })
  })

  const verifyResponse = await verifyReq.json()
  return verifyResponse
}

const getMe = async  () => {
  const token = getToken();
  if(!token) return false
  const getReq = await fetch(`${mainURL}/auth/me`, {
    method: 'GET',
    headers:{
      Authorization : `Bearer ${token}`
    }
  })
  const response = await getReq.json()

  setIntoSession('divar-user', response.data.user)
  return response.data.user
}

export{
  sendCode,
  verifyUser,
  getMe
}