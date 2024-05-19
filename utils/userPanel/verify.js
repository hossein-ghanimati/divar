import {getToken, mainURL} from "../shared.js"

const getBookmark = async () => {
  const getReq = await fetch(`${mainURL}/user/bookmarks`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  const response = await getReq.json()
  return response.data.posts
}

export {
  getBookmark
}