import { Channel, ConsumeMessage } from 'amqplib';  // Assuming you're using amqplib types
import { getChannel } from './index';

type MessageObject = {
  content: string;
  // Add more properties if needed
};

export const consumeFrom = async (queue: string = 'user_queue'): Promise<MessageObject> => {
  return new Promise(async (resolve, reject) => {
    const channel = getChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        const messageContent = msg.content.toString();
        console.log('Received message:', messageContent);
        const messageObj = JSON.parse(messageContent);
        // Process the message, construct your object
        // const messageObj: MessageObject = {
        //   content: messageContent,
        //   // Add other fields here if needed
        // };

        // Acknowledge the message
        channel.ack(msg);

        // Resolve with the object
        resolve(messageObj);

      } else {
        reject(new Error('No message received'));
      }
    });
  });
};

export const consumeUserMessages = async () => {
  
  const channel = getChannel();
  await channel.assertQueue('user_queue', { durable: true });
  channel.consume('user_queue', (msg:any) => {
    if (msg !== null) {
      const message = msg.content.toString();
      console.log('Received message:', message);
      // Process message
      channel.ack(msg);
    }
  });

};


// Usage example with async/await
// const processQueueMessage = async (channel: Channel, queue: string) => {
//   try {
//     const messageObj = await consumeMessage(channel, queue);
//     console.log('Processed Message:', messageObj);
//     // Further processing with the resolved message object
//   } catch (err) {
//     console.error('Error processing message:', err);
//   }
// };