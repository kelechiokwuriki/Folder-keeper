const mongoose = require('mongoose');

const SubFolderSchema = mongoose.Schema({
    name: String,
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SubFolder', SubFolderSchema);