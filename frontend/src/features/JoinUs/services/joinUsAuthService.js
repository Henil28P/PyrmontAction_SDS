import api from "../../../services/api"


const joinUsAuthenticationService = {
    createJoinSession(userDetails){
        return api.post("api/join/", userDetails, "")
    },
    createCheckoutSession(joinSessionID) {
        return api.post(`api/payments/create-checkout`, joinSessionID, "")
    }
}

export default joinUsAuthenticationService;