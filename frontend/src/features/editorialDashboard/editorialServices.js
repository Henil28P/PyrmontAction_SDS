import api from "../../services/api"

const editorialServices = {    
    // Project Management (following meeting minutes pattern)
    getAllProjects(token){ return api.get("api/projects/", token);},
    createProject(token, formData){ return api.postFormData("api/projects/", formData, token);},
    updateProject(token, id, data){ return api.put(`api/projects/${id}`, data, token);},
    updateProjectWithFile(token, id, formData){ return api.putFormData(`api/projects/${id}/upload`, formData, token);},
    deleteProject(token, id){ return api.delete(`api/projects/${id}`, token);},

    // Gallery Management
    getGalleryItems(token){ return api.get("api/gallery/", token);},
    uploadGalleryImage(token, formData){ return api.postFormData("api/gallery/", formData, token);},
    updateGalleryImage(token, id, formData){ return api.putFormData(`api/gallery/${id}`, formData, token);},
    deleteGalleryImage(token, id){ return api.delete(`api/gallery/${id}`, token);},

    // Event Management
    createEvent(token, formData){ return api.postFormData("api/events/", formData, token);},
    getUpcomingEvents(token){ return api.get("api/events/upcoming", token);},
    getCompletedEvents(token){ return api.get("api/events/completed", token);},
    updateEvent(token, id, data){ return api.putFormData(`api/events/${id}`, data, token);},
    publishEvent(token, id){ return api.put(`api/events/${id}/publish`, {}, token);},
    deleteEvent(token, id){ return api.delete(`api/events/${id}`, token);}

}

export default editorialServices;