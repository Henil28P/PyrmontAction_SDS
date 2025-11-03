import api from "../../services/api"

const dashboardServices = {    
    getCurrentUserDetails(token){ return api.get("api/users/me", token);},
    updateCurrentUser(token, userData){ return api.put("api/users/me", userData, token);},
    createRenewCheckout(token) { return api.get(`api/payments/renew-checkout/`, token);},
    
    // Meeting Minutes Management
    getAllMeetingMinutes(token){ return api.get("api/minutes/", token);},
    getPublishedMeetingMinutes(token){ return api.get("api/minutes/published", token);},
    createMeetingMinute(token, formData){ return api.postFormData("api/minutes/", formData, token);},
    updateMeetingMinute(token, id, data){ return api.put(`api/minutes/${id}`, data, token);},
    updateMeetingWithFile(token, id, formData){ return api.putFormData(`api/minutes/${id}/upload`, formData, token);},
    publishMeetingMinute(token, id, data){ return api.patch(`api/minutes/${id}/publish`, data, token);},
    deleteMeetingMinute(token, id){ return api.delete(`api/minutes/${id}`, token);},

    // Project Management (following meeting minutes pattern)
    getAllProjects(token){ return api.get("api/projects/", token);},
    createProject(token, formData){ return api.postFormData("api/projects/", formData, token);},
    updateProject(token, id, data){ return api.put(`api/projects/${id}`, data, token);},
    updateProjectWithFile(token, id, formData){ return api.putFormData(`api/projects/${id}/upload`, formData, token);},
    deleteProject(token, id){ return api.delete(`api/projects/${id}`, token);}
}

export default dashboardServices;