const Menu = require('../models/menu');

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

module.exports = { 
  getAllMenuData,
  getAllMenuDataNoFormat
 };
