import { mainURL } from "./shared.js";
const getAllCities = async () => {
    const getReq = await fetch(`${mainURL}/location`)
    const response = await getReq.json()
    return response.data
}

export{
    getAllCities
}