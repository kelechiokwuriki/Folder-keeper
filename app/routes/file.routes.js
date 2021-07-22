module.exports = (app) => {
    const fileController = require('../controllers/file.controller.js');
    
    // create a file
    app.post('/files', fileController.create);

    // get all files
    app.get('/files', fileController.all);

    // get single file
    // app.get('/files/:id', fileController.findOne);

    // update a single file
    app.put('/files/:id', fileController.update);

    //delete a file
    app.delete('/files/:id', fileController.delete);
}