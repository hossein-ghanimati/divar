
import {getUrlParam, mainURL} from "../shared.js"

let postFields = {}

const getSubDetails = async () => {
  const subID = getUrlParam('categoryID')
  const getReq = await fetch(`${mainURL}/category/sub/${subID}`)
  const response = await getReq.json()
  return response.data.category
}

const generateFieldSelectTemplate = field => `
  <div class="group">
    <p class="field-title">${field.name}</p>
    <div class="field-box">
      <select required="required" onchange="fieldChangeHandler('${
        field.slug
      }', event.target.value)">
        <option value="default">انتخاب</option>
        ${field.options.map(
          (option) =>
            `<option value="${option}">${option}</option>`
        )}
      </select>
      <svg>
        <use xlink:href="#select-arrow-down"></use>
      </svg>
    </div>
    <svg class="sprites">
      <symbol id="select-arrow-down" viewbox="0 0 10 6">
        <polyline points="1 1 5 5 9 1"></polyline>
      </symbol>
    </svg>
  </div>
`

const generateFieldCheckTemplate = field =>  `
  <div class="group checkbox-group">
    <input class="checkbox" type="checkbox" onchange="fieldChangeHandler('${field.slug}', event.target.checked)" />
    <p>${field.name}</p>
  </div>          
`

const insertDynamicFields = dynamicFields => {
  const dynamicFieldsContainer = document.querySelector('#dynamic-fields')
  dynamicFields.forEach(field => {
    if (field.type == "selectbox") {
      dynamicFieldsContainer.insertAdjacentHTML('beforeend', generateFieldSelectTemplate(field))      
    }else{
      dynamicFieldsContainer.insertAdjacentHTML('beforeend', generateFieldCheckTemplate(field))      
    }
  });
}

window.fieldChangeHandler = (slug, value) => {
  postFields[slug] = value;
  console.log(postFields);
}

export{
  getSubDetails,
  insertDynamicFields
}
