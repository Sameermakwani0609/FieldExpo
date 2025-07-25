// D:\FieldExpo\backend\config\db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('your_mongoDB_connection_string', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
