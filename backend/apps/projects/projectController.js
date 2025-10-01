const Project = require('./projectModel');

module.exports = {
    async openProjects(req, res){
        try{
            const openProjects = await Project.find({ project_type: 'open' });
            return res.status(200).json({projects: openProjects, type: "open"});
        }
        catch(error){
            return res.status(403).json({error: 'Error with the projects page'});
        }
    },

    async closedProjects(req, res){
        try{
            const closedProjects = await Project.find({ project_type: 'closed' });
            return res.status(200).json({projects: closedProjects, type: "closed"});
        }
        catch(error){
            return res.status(403).json({error: 'Error with the projects page'});
        }
    }, 

    async getProject(req, res) {
        const { id } = req.params;
        try{
            const project = await Project.findOne({ _id: id});
            res.status(200).json({project: project});
        }
        catch(error){
            return res.status(400).json({error: 'Error has occurred when retrieving project'});
        }
    },

    

}