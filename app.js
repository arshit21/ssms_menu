require('dotenv').config();

const express = require('express');
const multer = require('multer');
const uploadFile = require('./controllers/save');
const convertMenu = require('./controllers/convert');
const { getNextFifteenDaysMenu, getAllMenuDataNoFormat, getNextSevenDaysMenu } = require('./controllers/getData'); 

const app = express();

const upload = multer();

app.post('/upload-menu-ssms-tt', uploadFile, (req, res) => {
    return res.send('File uploaded!');
});

app.post('/convert-menu-ssms-tt', upload.none(), async (req, res) => {
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


app.get('/menu', async (req, res) => {
    try {
        await convertMenu();
        
        const menuData = await getNextFifteenDaysMenu();
        return res.json(menuData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/menu-2', async (req, res) => {
    try {
        await convertMenu();
        
        const menuData = await getAllMenuDataNoFormat();
        return res.json(menuData);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error during menu retrieval' });
    }
});

app.get('/menu-next-seven-days', async (req, res) => {
    try {
        const menuData = await getNextSevenDaysMenu();
        return res.json(menuData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error during menu retrieval for the next seven days' });
    }
});

app.listen(3000,'0.0.0.0',function () {
    console.log('Server is running on http://localhost:3000');
});
