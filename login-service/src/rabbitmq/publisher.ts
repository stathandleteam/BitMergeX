import { getChannel } from './index';

export const publishToUserQueue = async (message: any) => {
  const channel = getChannel();
  await channel.assertQueue('wallet_queue', { durable: true });
  channel.sendToQueue('wallet_queue', Buffer.from(JSON.stringify(message)));
};


export const publishTo = async (message: any, queneName: 'wallet_queue' = 'wallet_queue') => {
  const channel = getChannel();
  await channel.assertQueue(queneName, { durable: true });
  channel.sendToQueue(queneName, Buffer.from(JSON.stringify(message)));
};