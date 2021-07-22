const Folder = require('../models/folder.model.js');
const SubFolder = require('../models/subfolder.model.js');

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
exports.all = async (req, res) => {
    /**&&&&&&&&&&&&&&&& INCLUDE COUNT OF FILES IN FOLDERS AND SUB FOLDERS*/
    Folder.find().populate("subFolders")
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

// Update a folder 
exports.update = (req, res) => {
    // validate request
    if (!req.body.name && !req.params.id) {
        return res.status(400).send({
            success: false,
            message: 'Folder name or id cannot be empty'
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
            message: `Error updating folder with id ${folderId}`,
            error: error
        });
    })
};

// Delete a folder with the specified id in the request
exports.delete = (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            success: false,
            message: 'Folder id needed for deletion'
        });
    }

    let folderId = req.params.id;

    Folder.findByIdAndRemove(folderId)
    .then(async folder => {
        if (!folder) {
            return res.status(404).send({
                success: false,
                message: `Folder not found with id ${folderId}`
            });
        }

        // delete all subfolders
        await SubFolder.deleteMany({
            folder: folder.id
        });

        // delete all files associated also
        // *********************************

        res.status(200).send({
            success: true,
            message: 'Folder deleted successfully',
        });
    })
};

exports.createSubFolder = async (req, res) => {    
    if (!req.body.name || !req.body.folder) {
        return res.status(400).send({
            success: false,
            message: 'Subfolder name or folder id cannot be empty'
        });
    }

    const folderId = req.body.folder;
    const name = req.body.name;

    const folder = await Folder.findOne({_id: folderId});

    if (!folder) {
        return res.status(500).send({
            success: false,
            message: `Folder with ${folderId} does not exist. Unable to create sub-folder`
        })
    }

    const subFolder = new SubFolder({ 
        name: name || 'Untitled' ,
        folder: req.body.folder
    })

    subFolder.save()
    .then(async subFolderCreated => {
        // associate folder with subfolder
        folder.subFolders.push(subFolderCreated.id);
        folder.save();

        res.status(201).send({
            success: true,
            message: 'Subfolder created successfully',
            data: subFolderCreated
        });
    }).catch(error => {
        res.status(500).send({
            success: false,
            message: 'Failed to create the sub folder',
            error: error
        })
    })
};