import api from "../../../services/api"

const loginAuthentication = {    
    login(loginDetails) {
        return api.post("api/authentication/login", loginDetails, "")
    },

    refreshToken(refreshToken) {
        return api.post("api/authentication/refresh-token", { refreshToken }, "")
    },

    logout() {
        const token = localStorage.getItem('accessToken');
        return api.post("api/authentication/logout", {}, token)
    }
}

export default loginAuthentication;