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
    Folder.find()
    .then(folders => {
        res.send({
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

// Find a single note with a noteId
exports.findOne = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};