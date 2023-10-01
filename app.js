const express = require('express');
const uploadFile = require('./save');
const convertMenu = require('./convert');

const app = express();

app.post('/upload-menu', uploadFile, (req, res) => {
    return res.send('File uploaded!');
});

app.get('/convert-menu', async (req, res) => {
    await convertMenu();
    return res.send('Menu converted and saved!');
});

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});
