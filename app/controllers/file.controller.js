const File = require('../models/file.model.js');

// Create a folder
exports.create = (req, res) => {
    // validate request
    if (!req.body.name) {
        return res.status(400).send({
            success: false,
            message: 'File name cannot be empty'
        });
    }

    const folderType = req.query.folderType;

    if (!folderType) {
        return res.status(400).send({
            success: false,
            message: 'Please specfiy folder type'
        });
    }

    let newFile;

    switch (folderType) {
        case 'folder': {
            if (!req.body.folder) {
                return res.status(400).send({
                    success: false,
                    message: 'File needs a folder'
                });
            }
            newFile = new File({ 
                name: req.body.name || 'Untitled',
                folder: req.body.folder,
            });
        }
        break;

        case 'subFolder': {
            if (!req.body.subFolder) {
                return res.status(400).send({
                    success: false,
                    message: 'File needs a sub folder'
                });
            }
            newFile = new File({ 
                name: req.body.name || 'Untitled',
                subFolder: req.body.subFolder,
            });
        }
        break;

        default:
            return res.status(400).send({
                success: false,
                message: 'Folder type not recognized'
            });

    }

    newFile.save()
    .then(file => {
        res.status(201).send({
            success: true,
            message: 'File created successfully',
            data: file
        });
    }).catch(error => {
        res.status(500).send({
            success: false,
            message: 'Failed to create the file',
            error: error
        })
    })
};

// Retrieve and return all folders.
exports.all = async (req, res) => {
    File.find().populate("folder").populate("subFolder")
    .then(files => {
        res.status(200).send({
            success: true,
            message: 'All files retrieved',
            data: files
        });
    }).catch(error => {
        res.status(500).send({
            success: false,
            message: 'Failed to retrieve all files',
            error: error
        });
    })
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
    if (!req.params.id) {
        return res.status(400).send({
            success: false,
            message: 'File id needed for deletion'
        });
    }

    let fileId = req.params.id;

    File.findByIdAndRemove(fileId)
    .then(async file => {
        if (!file) {
            return res.status(404).send({
                success: false,
                message: `File not found with id ${fileId}`
            });
        }

        res.status(200).send({
            success: true,
            message: 'File deleted successfully',
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