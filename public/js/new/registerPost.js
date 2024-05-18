import { getSubDetails, insertDynamicFields } from "../../../utils/new/registerPost.js"

const loadSubDetails = async () => {
  const subDetails = await getSubDetails()
  console.log("Sub Details => ", subDetails);

  const categoryTitle = document.querySelector('.category_details p')
  categoryTitle.innerHTML = subDetails.title
  document.title = `ثبت آگهی - ${subDetails.title}`

  insertDynamicFields(subDetails.productFields)
}

loadSubDetails()