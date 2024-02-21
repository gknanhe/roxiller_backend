import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongoDB = async () => {
  try {
    console.log("inside mongo dir");
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDb Connected");
  } catch (error) {
    console.log("Error in connecting MONGODB", error.message);
  }
};

export default connectMongoDB;
