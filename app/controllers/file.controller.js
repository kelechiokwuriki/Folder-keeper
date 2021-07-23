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
    let query = {};
    let startsWith;

    if (req.query.name) {
        query.name = req.query.name;
    }

    // cant use both name searches
    if (req.query.startsWith && req.query.name) {
        return res.status(400).send({
            success: false,
            message: 'Can not use starts with and name query in tandem.',
        });
    }

    if (req.query.startsWith) {
        startsWith = req.query.startsWith;
        query.name = { $regex: '.*' + startsWith + '.*' };
    }

    const fileQuery = File.find(query);

    fileQuery.populate("folder").populate("subFolder")

    // limit by 10 if starts with is in query
    if (startsWith) {
        fileQuery.limit(10);
    }

    if (!fileQuery) {
        res.status(404).send({
            success: false,
            message: 'Failed to retrieve all files',
        });
    }

    res.status(200).send({
        success: true,
        message: 'All files retrieved',
        data: await fileQuery
    });
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
