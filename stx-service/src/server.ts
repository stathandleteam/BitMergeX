import { connectRabbitMQ } from './rabbitmq';
import app from './app';
import { connectMongoDB } from './database';
import { connectDB } from './helpers/logger';
import { consumeUserMessages } from './rabbitmq/consumer';
import redisClient from './redisDatabase';

const PORT = process.env.PORT || 5001;

  app.listen(PORT, async () => {
  
    await connectDB();

      // ping Redis database to connect
    await redisClient.ping();

    connectRabbitMQ().then(() => {
        consumeUserMessages();
    });
    
  console.log(`Server is running on port ${PORT}`);
});