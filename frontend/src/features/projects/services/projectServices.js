import api from "../../../services/api"

const projectsAPI = {    
    viewClosedProjects(){
        return api.get("api/projects/closed", "");
    },
    
    viewOpenProjects(){
        return api.get("api/projects/open", "");
    },
    getIndividualProjects(id){
        return api.get("api/projects/" + id , "");
    }
}

export default projectsAPI;
