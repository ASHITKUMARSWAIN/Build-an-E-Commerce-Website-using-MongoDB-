import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
};
export default connectDB;
