import app from './app';
import { connectMongoDB } from './database';
import { connectDB } from './helpers/logger';
import redisClient from './redisDatabase';

const PORT = process.env.PORT || 5000;

  app.listen(PORT, async () => {
  await connectDB();
  // mongoose connection
  // await connectMongoDB();

  // ping Redis database to connect
  redisClient.ping();

  console.log(`Server is running on port ${PORT}`);
});