const database = require('./DbSqLite');
const Promise = require('bluebird');

const redis = require('redis');
const client = redis.createClient();    // redis.createClient(port, host);

client.on('error', (err) => { console.log("Redis client Error " + err) });
client.on('connect', function() { console.log('Redis client Connected!'); });

const usersRedisKey = 'account:users';
function getAllUsers() {
    try {
        return new Promise((resolve, reject) => {
            client.get(usersRedisKey, (err, data) => { // string
                if(err) {
                    reject(err);
                    throw err;
                } else {
                    if(data) {
                        resolve(JSON.parse(data));
                    } else {
                        database.getAllUsers().then(rows => {
                            resolve(rows);
                            client.set(usersRedisKey, JSON.stringify(rows), function(err, reply) {
                                if(err) {
                                    reject(err);
                                    throw err;
                                    } //    console.log(reply); // OK
                            });
                        });
                    }
                }
            });
        });


        // https://www.sitepoint.com/using-redis-node-js/


    } catch (err) {
        console.log({ error: err.message });
    }
}

module.exports = {
    getAllUsers: getAllUsers
}