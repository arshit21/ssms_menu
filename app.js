const express = require('express');
const uploadFile = require('./save');
const convertMenu = require('./convert');
const { getMenuDataByDate } = require('./getData'); 

const app = express();

app.post('/upload-menu', uploadFile, (req, res) => {
    return res.send('File uploaded!');
});

app.get('/convert-menu', async (req, res) => {
    try {
        await convertMenu();
        return res.send('Menu converted and saved!');
    } catch (error) {
        if (error.message === 'Menu file not found') {
            console.error('File not found error:', error);
            return res.status(404).json({ error: 'Menu file not found' });
        } else {
            console.error('Conversion error:', error);
            return res.status(500).json({ error: 'Internal Server Error during conversion' });
        }
    }
});

app.get('/menu/:date', async (req, res) => {
    const { date } = req.params;

    try {
        // Wait for the conversion to complete before fetching data
        await convertMenu();
        const menuData = await getMenuDataByDate(new Date(date));
        return res.json(menuData);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error during menu retrieval' });
    }
});

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});
