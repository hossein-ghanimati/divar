import { mainURL, coverURL } from "./shared.js"

const getAllSocials = async () => {
  const getReq = await fetch(`${mainURL}/social`)
  const response = await getReq.json()
  return response.data.socials
}

const generateSocialTemplate = social => {
  return `
  <a href="${social.link}/hossein.front.js" class="sidebar__icon-link">
    <img width="18px" height="18px" src="${coverURL}/${social.icon.path}" alt="${social.name}" class="sidebar__icon bi bi-twitter">
  </a>
  `
}

const insertSocials = socials => {
  const socialsContainer = document.querySelector('#footer__social-media')

  socials.forEach(social => {
    socialsContainer.insertAdjacentHTML('beforeend', generateSocialTemplate(social))
  });
}

export {
  getAllSocials,
  insertSocials
}