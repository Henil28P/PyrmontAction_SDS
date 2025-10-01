import api from "../../../services/api"


const galleryServices = {
    getAllImages(){
        return api.get("api/gallery/", "")
    }
}

export default galleryServices;
