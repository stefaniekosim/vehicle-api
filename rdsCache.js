var redis = require('redis');
var redisClient = redis.createClient(6379, 'redisntw');

module.exports = redisClient;