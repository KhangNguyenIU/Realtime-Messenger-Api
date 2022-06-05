
const redis = require('redis')
const { promisify } = require('util')


const redisClient = redis.createClient({
    host: 'redis-12370.c276.us-east-1-2.ec2.cloud.redislabs.com',
    port: '12370',
})
try{
    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
    // redisClient.lpushAsync = promisify(redisClient.lpush).bind(redisClient);
    // redisClient.lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
    // redisClient.llenAsync = promisify(redisClient.llen).bind(redisClient);
    // redisClient.lremAsync = promisify(redisClient.lrem).bind(redisClient);
    // redisClient.lsetAsync = promisify(redisClient.lset).bind(redisClient);
    // redisClient.hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
    // redisClient.hmgetAsync = promisify(redisClient.hmget).bind(redisClient);
    redisClient.clear = promisify(redisClient.del).bind(redisClient);
}catch (e) {
    console.log("redis error", e);
}


redisClient.on("connect", function () {
    console.log("Redis is connected");
});
redisClient.on("error", function (err) {
    console.log("Redis error.", err);
});



redisClient.connect()

global.cache = redisClient;
module.exports = redisClient
