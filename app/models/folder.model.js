const mongoose = require('mongoose');

const FolderSchema = mongoose.Schema({
    name: String,
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    subFolders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubFolder"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Folder', FolderSchema);