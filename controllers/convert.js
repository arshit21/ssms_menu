const Excel = require('exceljs');
const Menu = require('../models/menu');
const db = require('../models/connectdb')
const fs = require('fs').promises;


async function getColumnCount(filePath) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1); // Assuming you want the first worksheet
  
    return worksheet.actualColumnCount;
  }


function processString(inputString) {
    if (inputString === null) {
        return null;
      }
  const cleanedString = inputString.replace(/\+/g, ' + ').replace(/\s+/g, ' ');

  const processedString = cleanedString.charAt(0).toUpperCase() + cleanedString.slice(1).toLowerCase();

  return processedString;
}

async function saveMenu(menuData) {
    try {
      const menu = new Menu(menuData);
      const savedMenu = await menu.save();
      console.log('Menu saved successfully:', savedMenu);
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  }
  
  async function clearDatabase() {
    try {
        await Menu.deleteMany({});
        console.log('Database cleared successfully');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
}
  

async function saveData(filePath, columnNumber) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  const currentColumn = worksheet.getColumn(columnNumber);
  const menuArray = [];
  currentColumn.eachCell({ includeEmpty: true }, (cell) => {
    menuArray.push(cell.value);
  });

  const menuData = {};
  menuData['date'] = new Date(menuArray[1]);
  menuArray[0] = processString(menuArray[0]);
  menuData['day'] = menuArray[0];
  menuData['breakfast'] = [];
  for (let i = 3; i < 12; i++) {
    const processedValue = processString(menuArray[i]);
    if (processedValue !== null && !/^\*+$/.test(processedValue)) {
      menuData.breakfast.push(processedValue);
    }
  }
  menuData['lunch'] = [];
  for (let i = 14; i < 22; i++) {
    const processedValue = processString(menuArray[i]);
    if (processedValue !== null && !/^\*+$/.test(processedValue)) {
      menuData.lunch.push(processedValue);
    }
  }
  menuData['dinner'] = [];
  for (let i = 24; i < 31; i++) {
    const processedValue = processString(menuArray[i]);
    if (processedValue !== null && !/^\*+$/.test(processedValue)) {
      menuData.dinner.push(processedValue);
    }
  }

  try {
    await saveMenu(menuData);
  } catch (error) {
    console.error('Error saving menu:', error);
  }
}

async function convertMenu() {
    console.log('convertMenu called');
    try {
        const filePath = 'menu.xlsx';
        await fs.access(filePath);
        const totalColumns = await getColumnCount(filePath);
        console.log(totalColumns);

        await clearDatabase();

        for (let i = 1; i < totalColumns + 1; i++) {
            const columnNumber = i;
            await saveData(filePath, columnNumber);
        }
        
    }  catch (error) {
      // Check if the error is due to the file not existing
      if (error.code === 'ENOENT') {
          // File not found error
          throw new Error('Menu file not found');
      } else {
          console.error('Error', error.message);
          throw error; // Re-throw other errors
      }
  }
};

module.exports = convertMenu;