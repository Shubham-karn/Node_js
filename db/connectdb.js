const mongoose = require('mongoose');

// MongoDB Connection
const dbUrl = `mongodb://127.0.0.1:27017/code-editor`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: {conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
