import api from "../../../services/api"

const memberServices = {    
    memberDisplay(token){
        return api.get("api/members", token);
    },
    

}

export default memberServices;
