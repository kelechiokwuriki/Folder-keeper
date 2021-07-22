module.exports = (app) => {
    const folderController = require('../controllers/folder.controller.js');
    
    // create a folder
    app.post('/folders', folderController.create);

    // get all folders
    app.get('/folders', folderController.all);

    // get single folder
    app.get('/folders/:id', folderController.findOne);

    // update a single folder
    app.put('/folders/:id', folderController.update);

    //delete folder
    app.delete('/folders/:id', folderController.delete);
}