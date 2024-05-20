import { calculateRelativeTimeDifference, coverURL, getToken, mainURL } from "../shared.js"

const getPostsData = async () => {
  const getReq = await fetch(`${mainURL}/user/posts`,{
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  const response = await getReq.json()
  return response.data
}

const generatePostTemplate = post => {
  const date = calculateRelativeTimeDifference(post.createdAt)
  return `
    <div class="post">
      <div class="post-info">
      ${
        post.pics.length
          ? `<img src="${coverURL}/${post.pics[0].path}" />`
          : `<img src="../../public/images/main/noPicture.PNG" />`
      }
      <div>
        <a ${post.status == "published" ? `href="../post.html?id=${post._id}"` : `href="./preview.html?id=${post._id}"`} class="title">${post.title}</a>
        <p class="price">${post.price.toLocaleString()} تومان</p>
        <p class="location">${date} در ${post.city.name}</p>
      </div>
    </div>

    <div class="post-status">
      <div>
          <p>وضعیت آگهی:</p>
          ${
            post.status === "published"
              ? `<p class="publish">منتشر شده</p>`
              : ""
          }
          ${
            post.status === "rejected"
              ? `<p class="reject">رد شده</p>`
              : ""
          }
          ${
            post.status === "pending"
              ? `<p class="pending">در صف انتشار</p>`
              : ""
          }
          
      </div>
      <a href="./preview.html?id=${post._id}" class="controll-btn">مدیریت اگهی</a>
    </div>
  </div>  
  `
}

export {
  getPostsData,
  generatePostTemplate
}