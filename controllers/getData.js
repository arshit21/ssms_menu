const Menu = require('../models/menu');
const moment = require('moment');

async function getNextFifteenDaysMenu() {
    try {
        let nextFifteenDaysMenu = [];
        for (let i = 0; i < 15; i++) {
            let date = moment().add(i, 'days').format('YYYY-MM-DD');
            let menuData = await Menu.findOne({ date: date });

            if (menuData) {
                const formattedItems = [];
                formattedItems.push(menuData.day.toUpperCase(), menuData.date.toISOString().split('T')[0]);
                formattedItems.push("BREAKFAST", ...menuData.breakfast);
                formattedItems.push(menuData.day.toUpperCase(), "LUNCH", ...menuData.lunch);
                formattedItems.push(menuData.day.toUpperCase(), "DINNER", ...menuData.dinner);
                nextFifteenDaysMenu.push(formattedItems);
            } else {
                nextFifteenDaysMenu.push(null);
            }
        }
        return {data: nextFifteenDaysMenu};
    } catch (error) {
        throw new Error('Error fetching and formatting menu data for the next fifteen days');
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
    getNextFifteenDaysMenu,
    getAllMenuDataNoFormat,
    getNextSevenDaysMenu
   };