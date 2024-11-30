import mongoose from "mongoose";
import { config } from "../config";
import { logger } from "../helpers";

export const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  };

  export const connectMongoDB = async () => {
    const { databaseUrl, databaseUser, databasePassword } = config;
  
    mongoose.connection
  
      .on(
        "error",
        /* istanbul ignore next */
        err => logger.error(err.message),
      )
      .on("disconnected", connectMongoDB)
      .once(
        "open",
        /* istanbul ignore next */
        () => logger.info(`MongoDB connected to ${databaseUrl}`),
      );
  
    await mongoose.connect(databaseUrl, {
      user: databaseUser,
      pass: databasePassword,
    });
  };