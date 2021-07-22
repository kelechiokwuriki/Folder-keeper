const mongoose = require('mongoose');

const FileSchema = mongoose.Schema({
    name: String,
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder"
    },
    subFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubFolder"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('File', FileSchema);