const Menu = require('../models/menu');
const moment = require('moment');

async function getAllMenuData() {
    try {
        // Retrieve menu data from the database
        const menuData = await Menu.find({});

        // Format the retrieved menu data
        const formattedData = menuData.map(item => {
            const formattedItems = [];
            formattedItems.push(item.day.toUpperCase(), item.date);
            formattedItems.push("BREAKFAST", ...item.breakfast);
            formattedItems.push(item.day.toUpperCase(), "LUNCH", ...item.lunch);
            formattedItems.push(item.day.toUpperCase(), "DINNER", ...item.dinner);
            return formattedItems;
        });

        return {data: formattedData};
    } catch (error) {
        throw new Error('Error fetching and formatting menu data');
    }
}

async function getAllMenuDataNoFormat() {
    try {
        // Specify fields to exclude from the query results
        const allMenuData = await Menu.find({}, { _id: 0, __v: 0 });
        return allMenuData;
    } catch (error) {
        throw new Error('Error fetching all menu data');
    }
}


 async function getNextSevenDaysMenu() {
    try {
        let nextSevenDaysMenu = [];
        for (let i = 0; i < 7; i++) {
            let date = moment().add(i, 'days').format('YYYY-MM-DD');
            let menuData = await Menu.findOne({ date: date }, { _id: 0, __v: 0 });

            if (menuData) {
                menuData = menuData.toObject();
                if (menuData.date) {
                    menuData.date = menuData.date.toISOString().split('T')[0];
                    nextSevenDaysMenu.push(menuData);
                }
            } else {
                nextSevenDaysMenu.push(null);
            }
        }
        return [...nextSevenDaysMenu];
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching and formatting menu data for the next seven days');
    }
};

module.exports = { 
    getAllMenuData,
    getAllMenuDataNoFormat,
    getNextSevenDaysMenu
   };