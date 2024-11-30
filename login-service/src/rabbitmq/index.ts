import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();

  try {
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  return channel;
};
