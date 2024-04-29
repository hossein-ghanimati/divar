const mainURL = "https://divarapi.liara.run/v1"
const coverURL = "https://divarapi.liara.run"

const hideLoader = () => {
    const loaderElem = document.querySelector('#loading-container')
    loaderElem.style.display = "none"
}

const setIntoLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

const getFromLocal = key => {
    return JSON.parse(localStorage.getItem(key))
}
export{
    mainURL,
    coverURL,
    hideLoader,
    setIntoLocal,
    getFromLocal
}