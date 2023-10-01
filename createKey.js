const mongoose = require('mongoose');
const AuthKey = require('./models/key');

mongoose.connect('mongodb://localhost/ssms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    const key = 'abcdefghijklmnopqrstuvw';
    const authKey = new AuthKey({ key });
    await authKey.save();
    console.log('Authentication key saved successfully.');
    db.close();
  } catch (error) {
    console.error('Error saving authentication key:', error);
  }
});

db.on('error', (error) => {
  console.error('Error connecting to the database:', error);
});




