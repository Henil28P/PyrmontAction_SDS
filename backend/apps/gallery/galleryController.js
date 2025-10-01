const Gallery = require('./galleryModel')
module.exports = {
    async getAllGalleryImage(req, res){
        try{
            const images = await Gallery.find().sort({createdAt: -1});
            res.status(200).json({message: 'Successful images', images: images})
        }
        catch(error){
            return res.status(400).json({error: 'Error with the Image page'});
        }

    }        
}