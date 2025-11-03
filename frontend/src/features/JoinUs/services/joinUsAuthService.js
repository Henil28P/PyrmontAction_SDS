import api from "../../../services/api"


const joinUsAuthenticationService = {
    createJoinSession(userDetails){
        return api.post("api/join/", userDetails, "")
    },
    deleteJoinSession(id){
        return api.delete(`api/join/${id}`)
    },
    createCheckoutSession(joinSessionID) {
        return api.post(`api/payments/join-checkout`, joinSessionID, "")
    }

}

export default joinUsAuthenticationService;