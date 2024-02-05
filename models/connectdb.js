const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0/ssms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});

db.on('error', (error) => {
  console.error('Error connecting to the database:', error);
});

module.exports = db;
