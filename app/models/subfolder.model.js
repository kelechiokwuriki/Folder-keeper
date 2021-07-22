const mongoose = require('mongoose');

const SubFolderSchema = mongoose.Schema({
    name: String,
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SubFolder', SubFolderSchema);