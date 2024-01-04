const { Kafka, logLevel } = require('kafkajs')
const runConsumer = async () => {

    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092:9092'],
        logLevel: logLevel.NOTHING
    })
    
    const consumer = kafka.consumer({ groupId: 'test-group' })
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
    
  })
}

runConsumer().catch(console.error)