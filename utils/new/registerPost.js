
import {getToken, getUrlParam, mainURL, showSwal} from "../shared.js"
const picturesContainer = document.querySelector('.pictures-wrapper')
const citySelector = document.querySelector('#city')
const neighborhoodSelector = document.querySelector('#neighborhood')  
const cityChoice = new Choices(citySelector)
const neighborhoodChoice = new Choices(neighborhoodSelector)

const priceEl = document.querySelector('#price')
const exchangeEl = document.querySelector('#exchange')

const titleEl = document.querySelector('#title')
const descriptionEl = document.querySelector('#description')

let pics = []
// const
let mapView = {x:35.715298, y:51.404343}

let postDynamicFields = {}

const getSubDetails = async () => {
  const subID = getUrlParam('categoryID')
  const getReq = await fetch(`${mainURL}/category/sub/${subID}`)
  const response = await getReq.json()
  return response.data.category
}

const generateFieldSelectTemplate = field => `
  <div class="group">
    <p class="title">${field.name}</p>
    <label class="select" for="field-${field.slug}">
        <select id="field-${field.slug}" required="required" onchange="fieldChangeHandler('${field.slug}', event.target.value)">
          <option value=null>پیش فرض</option>
            ${
              field.options.map(option => 
                `<option value="${option}">${option}</option>`
              )
            }
        </select>
        <svg>
            <use xlink:href="#select-arrow-down"></use>
        </svg>
    </label>
  </div>
`

const generateFieldCheckTemplate = field =>  `
  <div class="groups">
    <div class="map-controll">
      <p>${field.name}</p>
      <label class="switch">
        <input class="icon-controll" type="checkbox"  onchange="fieldChangeHandler('${field.slug}', event.target.checked)">
        <span class="slider round"></span>
      </label>
    </div>
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

const handelDynamicDefaultData = dynamicFields => {
  dynamicFields.forEach(field => {
    if (field.type == "selectbox") {
      postDynamicFields[field.slug] = "null";
    }else{
      postDynamicFields[field.slug] = false
    }
  })
}

const validateElValue = el => el.value.trim() != ''

const statisFieldsValidation = () => {
  let areAllFields= false;
  if (
      neighborhoodSelector.value != "default" && 
      validateElValue(priceEl) && 
      validateElValue(titleEl) && 
      validateElValue(descriptionEl)
    ){
    areAllFields = true
  }
  return areAllFields
}

const dynamicFieldsValidation = () => {
  let areAllFields = true;
  for (const field in postDynamicFields){
    if (postDynamicFields[field] == "null") {
      areAllFields = false;
    }
  }

  return areAllFields
}

const createFormData = () => {
  const formData = new FormData();
  formData.append('city', citySelector.value)
  formData.append('neighborhood', neighborhoodSelector.value)
  formData.append('title', titleEl.value)
  formData.append('description', descriptionEl.value)
  formData.append('price', priceEl.value)
  formData.append('exchange', exchangeEl.checked)
  formData.append('map', JSON.stringify(mapView))
  formData.append('categoryFields', JSON.stringify(postDynamicFields))
  pics.forEach(pic => {
    formData.append('pics', pic)
  })

  return formData
}


const sendFormData = async formData => {
  return await fetch(`${mainURL}/post/${getUrlParam('categoryID')}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  })
}


/////// Cities Funcs \\\\\\

const getAllCitiesData = async () => {
  const getReq = await fetch(`${mainURL}/location`);
  const response = await getReq.json();
  return response.data;
}

const allCitites = await getAllCitiesData()
const defaultNeighborhoods = allCitites.neighborhoods.filter(neighborhood => neighborhood.city_id == 301)

const handelCities = () => {
  const cities = allCitites.cities
  cityChoice.setChoices([
    ...cities.map(city => ({
      value: city.id,
      label: city.name,
      selected: city.id == 301 ? true : false
    }))
  ], "value", "label", false)
}

  
const handelNeighborhoods = neighborhoods => {
  neighborhoodChoice.clearStore();
  neighborhoodChoice.setChoices([
    {
      value: "default",
      label: "انتخاب محله", 
      selected: true, 
      disabled: true
    },
    ...neighborhoods.map(neighborhood => ({
      value: neighborhood.id,
      label: neighborhood.name
    }))
   
  ], "value", "label",  false)
}

citySelector.addEventListener('addItem', e => {
  const neighborhoods = allCitites.neighborhoods.filter(neighborhood => 
    neighborhood.city_id == e.detail.value
  )

  handelNeighborhoods(neighborhoods)
})

//// Pictur Uploading Codes   \\\\
const pathValidation = path => {
  const avalibPaths = ["image/jpg", "image/png", "image/jpeg"]
  return avalibPaths.includes(path)
}

const sizeValidation = size => size <= 1000_000_000

const lengthValidation = () => pics.length <= 20

const handelPicUploader = () => {
  const uploadBtn = document.querySelector('.uploader-box input')
  uploadBtn.addEventListener('change', e => {
    const picture = e.target.files[0]
    console.log(picture);
    const isValid = pathValidation(picture.type) && sizeValidation(picture.size) && lengthValidation()
    if (isValid) {
      pics.push(picture)
      console.log(pics);
      insertPictures(pics)
    }else{
      alert('عکس معتبر نیست')
    }
  })
}

const generatePictureBoxTemplate = (src, picName) => `
  <div class="image-box" onclick="removePic('${picName}')">
    <div>
      <i class="bi bi-trash"></i>
    </div>
    <img src="${src}"/>
  </div>
`

const insertPictures = pictures => {
  picturesContainer.innerHTML = ''
  pictures.forEach(picture => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const src = reader.result
      picturesContainer.insertAdjacentHTML('beforeend', generatePictureBoxTemplate(src, picture.name))
    }
    reader.readAsDataURL(picture)
  })
  
}

const mapMoveHandler = (map, mapMarker) => {
  const center = map.getSize().divideBy(2);
  const targetPoint = map.containerPointToLayerPoint(center)
  const targetLatLng = map.layerPointToLatLng(targetPoint)

  mapMarker.setLatLng(targetLatLng)
  mapView.x = targetLatLng.lat;
  mapView.y = targetLatLng.lng
}

window.removePic = picName => {
  pics = pics.filter(pic => pic.name != picName)
  insertPictures(pics)
}

window.fieldChangeHandler = (slug, value) => {
  postDynamicFields[slug] = value;
}



export{
  getSubDetails,
  insertDynamicFields,
  handelDynamicDefaultData,
  statisFieldsValidation,
  dynamicFieldsValidation,
  createFormData,
  sendFormData,
  handelCities,
  handelNeighborhoods,
  getAllCitiesData,
  handelPicUploader,
  mapMoveHandler
}
