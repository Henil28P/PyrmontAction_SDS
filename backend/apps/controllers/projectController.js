const Project = require('../models/projectModel');

module.exports = {
    // Create project with image upload (following meeting minutes pattern)
    async createProject(req, res) {   
        try {
            const { project_name, project_description, project_type } = req.body;
            
            const projectData = { 
                project_name, 
                project_description, 
                project_type: project_type,
                project_date: new Date(req.body.project_date)
            };

            // If file was uploaded, process it (similar to meeting minutes)
            if (req.file) {
                // Add file info to project (mapping to project model fields)
                projectData.project_imageUrl = `/uploads/projects/${req.file.filename}`;
                projectData.project_image = req.file.originalname;
            }

            const project = new Project(projectData);
            await project.save();

            res.status(201).json(project);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

 

    // Read - List all projects (following meeting minutes pattern)
    async getAllProjects(_req, res) {
        try {
            const allProjects = await Project.find().sort({ project_date: -1 });
            res.json(allProjects);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Read - List open projects
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
        try{
            const { id } = req.params;
            const project = await Project.findOne({ _id: id});
            res.status(200).json({project: project});
        }
        catch(error){
            return res.status(400).json({error: 'Error has occurred when retrieving project'});
        }
    },

    // Update project (following meeting minutes pattern)
    async updateProject(req, res) {
        try {
            const { id } = req.params;
            const { project_name, project_description, project_type, project_image } = req.body;
            const project_date = req.body.project_date ? new Date(req.body.project_date) : undefined;
            
            const updatedProject = await Project.findByIdAndUpdate(
                id,
                { project_name, project_description, project_type, project_image, project_date },
                { new: true }
            );
            
            if (!updatedProject) return res.status(404).json({ message: 'Not found' });
            res.json(updatedProject);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Update project with file upload (following meeting minutes pattern)
    async updateProjectWithFile(req, res) {   
        try {
            const { project_name, project_description, project_type } = req.body;
            const projectData = { 
                project_name, project_description, project_type,
                project_date: new Date(req.body.project_date)
             };

            // If file was uploaded, process it
            if (req.file) {
                // Add file info to project (mapping to project model fields),
                projectData.project_imageUrl = `/uploads/projects/${req.file.filename}`;
                projectData.project_image = req.file.originalname;
            }

            const updatedProject = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true });
            res.status(200).json(updatedProject);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Delete project (following meeting minutes pattern)
    async deleteProject(req, res) {
        try {
            const deletedProject = await Project.findByIdAndDelete(req.params.id);
            if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

}