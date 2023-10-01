const express = require('express');
const uploadFile = require('./save');
const convertMenu = require('./convert');
const { getMenuDataByDate } = require('./getData'); 

const app = express();

app.post('/upload-menu', uploadFile, (req, res) => {
    return res.send('File uploaded!');
});

app.get('/convert-menu', async (req, res) => {
    await convertMenu();
    return res.send('Menu converted and saved!');
});

app.get('/menu/:date', async (req, res) => {
    const { date } = req.params;

    try {
        const menuData = await getMenuDataByDate(new Date(date));
        return res.json(menuData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});
