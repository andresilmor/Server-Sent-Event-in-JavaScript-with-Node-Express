const express = require('express')
const parseArgs = require('minimist');
const { v4: uuid } = require('uuid');
const redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoDB_URL = "mongodb+srv://andresilmor:project-greenhealth@carexr-mongodb-cluster.mcnxmz7.mongodb.net/?retryWrites=true&w=majority";
const Redis_URL = 'redis://default:EGGjURloNvz8K6fpudILQdYQWbEV8zhm@redis-19874.c233.eu-west-1-1.ec2.cloud.redislabs.com:19874';

module.exports = {
    EXPRESS: express,
    PARSE_ARGS: parseArgs,
    UUID: uuid,
    BODYPARSER: bodyParser,
    CORS: cors,
    REDIS: redis,
    REDIS_URL: Redis_URL

}