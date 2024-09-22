import mongoose from "mongoose";

import { logger } from "../helpers";
import { config } from "../config";

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