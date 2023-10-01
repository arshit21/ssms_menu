const Menu = require('./models/menu');
const db = require('./connectdb');

async function getMenuDataByDate(date) {
    try {
      const menuData = await Menu.findOne({ date }); // Assuming 'date' is a field in your schema
      return menuData;
    } catch (error) {
      throw new Error('Error fetching menu data');
    }
  }
  
  module.exports = { getMenuDataByDate };
  

module.exports = { getMenuDataByDate };
