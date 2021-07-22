const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('API running on port 3000');
})

app.post('/folder', (req, res) => {
    //create folder with name
})

app.post('/sub-folder', (req, res) => {
    // create sub folder and attach to folder
})

app.post('/file', (req, res) => {
    // create a file with folder id
})

app.get('/file', (req, res) => {
    let searchName = req.query.name;
    let folderId = req.query.folderId;

    if (folderId && searchName) {
        //return all files with name and specified folder id
    }

    if (searchName) {
        // return all files with name
    }
})

app.delete('/folder', (req, res) => {  
    let folderId = req.query.id;

    if (folderId) {
        // delete folder with ID
    }
})

app.put('/folder', (req, res) => {
    
})