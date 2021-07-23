const File = require('../models/file.model.js');
const SubFolder = require('../models/subfolder.model.js');
const Folder = require('../models/folder.model.js');


// Create a file
exports.create = async (req, res) => {
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
            message: 'Please specfiy folder type in query'
        });
    }


    let newFile;
    let folderFound;

    switch (folderType) {
        case 'folder': {
            if (!req.body.folder) {
                return res.status(400).send({
                    success: false,
                    message: 'File needs a folder, please add to request body'
                });
            }
            newFile = new File({ 
                name: req.body.name || 'Untitled',
                folder: req.body.folder,
            });

            folderFound = await Folder.findOne({
                _id: req.body.folder
            })
        }
        break;

        case 'subFolder': {
            if (!req.body.subFolder) {
                return res.status(400).send({
                    success: false,
                    message: 'File needs a sub folder, please add to request body'
                });
            }
            newFile = new File({ 
                name: req.body.name || 'Untitled',
                subFolder: req.body.subFolder,
            });

            folderFound = await SubFolder.findOne({
                _id: req.body.subFolder
            })
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
        // make association to folder
        folderFound.files.push(file.id);

        folderFound.save();

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

// Retrieve and return all files.
exports.all = async (req, res) => {
    if (req.query.name) {
        const name = req.query.name;

        const fileFound = await File.findOne({
            name
        }).populate('folder').populate('subFolder');

        if (fileFound) {
            return res.status(200).send({
                success: true,
                message: "File retrieved",
                data: fileFound
            });
        }

        return res.status(404).send({
            success: false,
            message: `Failed to find file with name ${name}`,
        });
    }

    File.find().populate("folder").populate("subFolder")
    .then(files => {
        res.status(200).send({
            success: true,
            message: 'All files retrieved',
            data: files
        });
    }).catch(error => {
        res.status(404).send({
            success: false,
            message: 'Failed to retrieve all files',
            error: error
        });
    })
};

// Update file 
exports.update = (req, res) => {
    // validate request
    if (!req.body.name && !req.params.id) {
        return res.status(400).send({
            success: false,
            message: 'File name or id cannot be empty'
        });
    }

    let fileId = req.params.id;
    let name = req.body.name;

    File.findByIdAndUpdate(fileId, {
        name: name || 'Untitled'
    }, { new: true })
    .then(file => {
        if (!file) {
            return res.status(404).send({
                success: false,
                message: `File not found with id ${fileId}`
            })
        }

        res.status(201).send({
            success: true,
            message: 'File updated successfully',
            data: file
        });
    }).catch(error => {
        if(error.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: `File not found with id ${fileId}`
            })               
        }
        return res.status(500).send({
            message: `Error updating file with id ${fileId}`,
        });
    })
};


// Delete a file with the specified id in the request
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
