const mongoose = require('mongoose');

const connectDB = async () => {
  try{
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  }
  catch(error){
    console.log('MongoDB connected failed',error.message);
    process.exit(1);
  }
};

module.exports = connectDB;