import api from "../../services/api"

const dashboardServices = {
    // Community Member Services
    getCurrentUserDetails(token){ return api.get("api/users/me", token);},
    updateCurrentUser(token, userData){ return api.put("api/users/me", userData, token);},
    createRenewCheckout(token) { return api.get(`api/payments/renew-checkout/`, token);},
    deleteCurrentUser(token){ return api.delete("api/users/me", token);},
    getPublishedMeetingMinutes(token){ return api.get("api/minutes/published", token);},
    
    // Admin Meeting Minutes Management
    getAllMeetingMinutes(token){ return api.get("api/minutes/", token);},
    createMeetingMinute(token, formData){ return api.postFormData("api/minutes/", formData, token);},
    updateMeetingMinute(token, id, data){ return api.put(`api/minutes/${id}`, data, token);},
    updateMeetingWithFile(token, id, formData){ return api.putFormData(`api/minutes/${id}/upload`, formData, token);},
    publishMeetingMinute(token, id, data){ return api.patch(`api/minutes/${id}/publish`, data, token);},
    deleteMeetingMinute(token, id){ return api.delete(`api/minutes/${id}`, token);},
    
    // Admin Members List View
    getActiveMembers(token){ return api.get("api/users/active-members", token);},

    // Admin Account Manager 
    createManager(token, managerData){ return api.post("api/users/manager", managerData, token);},
    generateRandomPassword(token, id){ return api.get(`api/users/password/${id}`, token);},
    getAllUsers(token){ return api.get("api/users/", token);},
    changeManagerRole(token, id){ return api.put(`api/users/role/${id}`, {}, token);},
    deleteUserById(token, id){ return api.delete(`api/users/${id}`, token);}
}

export default dashboardServices;