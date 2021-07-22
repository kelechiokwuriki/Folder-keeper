const Folder = require('../models/folder.model.js');

// Create a folder
exports.create = (req, res) => {
    // validate request
    if (!req.body.name) {
        return res.status(400).send({
            success: false,
            message: 'Folder name cannot be empty'
        });
    }

    const newFolder = new Folder({ name: req.body.name || 'Untitled' })

    newFolder.save()
    .then(folder => {
        res.status(201).send({
            success: true,
            message: 'Folder created successfully',
            data: folder
        });
    }).catch(error => {
        res.status(500).send({
            success: false,
            message: 'Failed to create the folder',
            error: error
        })
    })
};

// Retrieve and return all folders.
exports.all = (req, res) => {
    /**&&&&&&&&&&&&&&&& INCLUDE COUNT OF FILES IN FOLDERS AND SUB FOLDERS*/
    Folder.find()
    .then(folders => {
        res.status(200).send({
            success: true,
            message: 'All folders retrieved',
            data: folders
        });
    }).catch(error => {
        res.status(500).send({
            success: false,
            message: 'Failed to retrieve all folders',
            error: error
        });
    })
};

// Find a folder note with a folder id
exports.findOne = (req, res) => {

};

// Update a folder identified by the noteId in the request
exports.update = (req, res) => {
    // validate request
    if (!req.body.name) {
        return res.status(400).send({
            success: false,
            message: 'Folder name cannot be empty'
        });
    }

    if (!req.params.id) {
        return res.status(400).send({
            success: false,
            message: 'Folder id needed for update'
        });
    }

    let folderId = req.params.id;
    let name = req.body.name;

    Folder.findByIdAndUpdate(folderId, {
        name: name || 'Untitled'
    }, { new: true })
    .then(folder => {
        if (!folder) {
            return res.status(404).send({
                success: false,
                message: `Folder not found with id ${folderId}`
            })
        }

        res.status(201).send({
            success: true,
            message: 'Folder updated successfully',
            data: folder
        });
    }).catch(error => {
        if(error.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: `Folder not found with id ${folderId}`
            })               
        }
        return res.status(500).send({
            message: `Error updating folder with id ${folderId}`
        });
    })
};

// Delete a folder with the specified id in the request
exports.delete = (req, res) => {

};