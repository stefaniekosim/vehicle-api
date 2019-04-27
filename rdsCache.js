var redis = require('redis');
var redisClient = redis.createClient(6379, 'localhost');

module.exports = redisClient;