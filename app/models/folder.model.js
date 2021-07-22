const mongoose = require('mongoose');

const FolderSchema = mongoose.Schema({
    name: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Folder', FolderSchema);