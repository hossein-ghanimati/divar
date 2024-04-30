import { getAllSocials, insertSocials } from "../../utils/socials.js";

const renderSocials = async () => {
  const socials = await getAllSocials();
  console.log("Socials =>", socials);

  insertSocials(socials)
}


renderSocials() 

