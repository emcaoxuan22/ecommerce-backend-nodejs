const redis = require('redis');
const client = redis.createClient();

// Đặt giá trị vào Redis
const key = 'longcv';
const value = '15';

client.set(key, value, (err, reply) => {
  if (err) {
    console.error('Error setting value:', err);
  } else {
    console.log('Value set in Redis:', reply);
  }

//   Đóng kết nối Redis
  client.quit();
});