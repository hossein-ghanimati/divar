import { getMe } from "../public/js/auth.js";

const mainURL = "https://divarapi.liara.run/v1";
const coverURL = "https://divarapi.liara.run";

const hideLoader = () => {
  const loaderElem = document.querySelector("#loading-container");
  loaderElem.style.display = "none";
};

const showLoader = () => {
  const loaderElem = document.querySelector("#loading-container");
  loaderElem.style.display = "flex";
}

const setIntoLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocal = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const setIntoSession = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
}

const getFromSession = (key) => {
  return JSON.parse(sessionStorage.getItem(key));
};

const setParamToUrl = (param, value) => {
  const url = new URL(location.href);
  const searchedParams = url.searchParams;

  searchedParams.set(param, value);
  url.search = searchedParams.toString();

  location.href = url.toString();
};

const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(location.search);
  return  urlParams.get(param);
};

const removeUrlParam = param => {
  const urlParams = new URLSearchParams(location.search);
  const url = new URL(location.href);

  urlParams.delete(param);
  
  url.search = urlParams.toString();

  location.href = url.toString();
}

const calculateRelativeTimeDifference = (createdAt) => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);
  const time = currentTime - createdTime;
  // console.log(time);
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = week * 4 + 2;
  const year = month * 12;

  let date = null;

  if (time < minute) {
    date = "لحظاتی پیش";
  } else if (time < hour) {
    const calculatedTime = Math.floor(time / minute);
    date = `${calculatedTime} دقیقه پیش`;
  } else if (time < day) {
    const calculatedTime = Math.floor(time / hour);
    date = `${calculatedTime} ساعت پیش`;
  } else if (time < week) {
    const calculatedTime = Math.floor(time / day);
    date = `${calculatedTime} روز پیش`;
  } else if (time < month) {
    
    const calculatedTime = Math.floor(time / week);
    date = `${calculatedTime} هفته پیش`;
  } else if (time < year) {
    const calculatedTime = Math.floor(time / month);
    date = `${calculatedTime} ماه پیش`;
  } else if (time >= week) {
    const calculatedTime = Math.floor(time / week);
    date = `${calculatedTime} سال پیش`;
  }

  return date;
};

const hideElem = (elem) => {
  elem.style.display = 'none';
}

const showElem = (elem, display = "block") => {
  elem.style.display = display
}

const showModal = (selector, className) => {
  const modal = document.querySelector(selector)
  modal.classList.add(className)
}

const hideModal = (selector, className) => {
  const modal = document.querySelector(selector)
  modal.classList.remove(className)
}

const getToken = () => {
  return getFromLocal('divar-token')
}

const checkLogin = async () => {
  const userInfo = getFromSession('divar-user') || await getMe()
  const isLogin = userInfo?._id && userInfo?.phone

  return !!isLogin
}

const showSwal = (title, text, icon, buttons, callback) => {
  swal({
    title,
    text,
    icon,
    buttons,
  }).then(result =>{
    callback(result)
  })
}


export {
  mainURL,
  coverURL,
  hideLoader,
  showLoader,
  setIntoLocal,
  getFromLocal,
  setParamToUrl,
  getUrlParam,
  calculateRelativeTimeDifference,
  removeUrlParam,
  hideElem,
  showElem,
  showModal,
  hideModal,
  checkLogin,
  showSwal,
  getToken,
  setIntoSession,
  getFromSession
};

