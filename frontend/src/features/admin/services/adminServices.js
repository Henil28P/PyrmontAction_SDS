import api from "../../../services/api"

const adminServices = {    
    adminDisplay(token){
        return api.get("api/admin", token);
    },
    

}

export default adminServices;
