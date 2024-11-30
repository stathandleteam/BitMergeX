import { getChannel } from './index';

export const publishToUserQueue = async (message: any) => {
  const channel = getChannel();
  await channel.assertQueue('user_queue', { durable: true });
  channel.sendToQueue('user_queue', Buffer.from(JSON.stringify(message)));
};

type QueueType = 'user_queue'

export const publishTo = async (message: any, queue: QueueType = 'user_queue') => {
  const channel = getChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};