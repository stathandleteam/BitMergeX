import { registerUserAndCreateWallet } from '../controllers';
import { getChannel } from './index';
import { publishTo } from './publisher';
import restoreUserWallet from '../rmq-events/restoreUserWallet';

const processIncomingData = async (event: string, data: any,) => {
  return new Promise<any>(async (resolve, reject) => {
      try {
          // Process message
          let walletCreated;
          switch (event) {
            case 'createWallet':
              console.log('Received message:', data);
              walletCreated = registerUserAndCreateWallet(data);
              break;
            case 'restoreWallet':
              console.log('Received message:', data);
              walletCreated = restoreUserWallet(data);
              break;
            default:
              break;
          }
          resolve(walletCreated);
      } catch (error: any) {        
        console.log("error", error);
        
        reject(error);
      }
    
  })
}

export const consumeUserMessages = async () => {
  const channel = getChannel();
  await channel.assertQueue('wallet_queue', { durable: true });

  channel.consume('wallet_queue', async(msg:any) => {
    if (msg !== null) {
      
      const message = msg.content.toString();

      const { event, data } = JSON.parse(message);

      console.log("Received message:", message);

      // Promise here

      try {

        const walletCreated = await processIncomingData(event, data);

        // Message Acknowledge
        channel.ack(msg);
  
        // Publish to user queue
        const walletCreatedData = {
          event: 'walletCreated',
          data: walletCreated,
        }
  
        console.log("walletCreated", walletCreated);
        switch (event) {  
          case 'createWallet':
            publishTo(walletCreatedData, 'user_queue');
            break;
          default:
            break;
        }
  
      } catch (error:any) {

        channel.ack(msg);

        // Publish error response to user_queue
        const errorData = {
          event: 'walletCreationFailed',
          success: false,   // Indicate failure
          error: error.message,  // Send the error message back
        };

        console.error("Error while creating wallet:", error);
        publishTo(errorData, 'user_queue');  // Send error event back to RabbitMQ
      }

    }
  });
};
