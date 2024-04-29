const mainURL = "https://divarapi.liara.run/v1"
const hideLoader = () => {
    const loaderElem = document.querySelector('#loading-container')
    loaderElem.style.display = "none"
}
export{
    mainURL,
    hideLoader
}