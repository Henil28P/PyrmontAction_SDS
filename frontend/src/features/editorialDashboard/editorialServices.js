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

    // Blog Management
    getAllBlogs(token) { return api.get("api/blogs/", token); },
    createBlog(token, data) { return api.postData("api/blogs/", data, token); },
    updateBlog(token, id, data) { return api.putData(`api/blogs/${id}`, data, token); },
    approveBlog(token, id) { return api.putData(`api/blogs/${id}`, { status: "approved" }, token); },
    deleteBlog(token, id) { return api.delete(`api/blogs/${id}`, token); },

}

export default editorialServices;
