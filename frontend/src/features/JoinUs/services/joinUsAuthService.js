import api from "../../../services/api"


const joinUsAuthenticationService = {
    joinus(userDetails){
        return api.post("api/submitForm", userDetails, "")
    }
}

export default joinUsAuthenticationService;
