import amqp from 'amqplib'

export async function rabbitMq () {
    const rabbitMQUrl = 'amqp://localhost'
    const connection = await amqp.connect(rabbitMQUrl)
    const channel = await connection.createChannel()
    const queue = 'telegram_messages'
    await channel.assertQueue(queue, { durable: false })

    return channel
}