import {getToken, mainURL} from "../shared.js"

const verifyUser = async nationalCode => {
  console.log(nationalCode);
  return await fetch(`${mainURL}/user/identity`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({nationalCode})
  })
}

export {
  verifyUser
}