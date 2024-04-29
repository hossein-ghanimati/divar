const mainURL = "https://divarapi.liara.run/v1"
const coverURL = "https://divarapi.liara.run"
const hideLoader = () => {
    const loaderElem = document.querySelector('#loading-container')
    loaderElem.style.display = "none"
}
export{
    mainURL,
    coverURL,
    hideLoader
}