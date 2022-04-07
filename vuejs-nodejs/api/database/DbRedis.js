const database = require('./DbSqLite');

const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => { console.log("Error " + err) });

const usersRedisKey = 'account:users';
function getAllUsers() {
    var users;
    (async () => {
       await client.connect();
        users = await client.get(usersRedisKey);
        if(!users) {
            users = await Promise.all([database.getAllUsers()]);
            await client.set(usersRedisKey, JSON.stringify(users));
        } else {
            users =  JSON.parse(users);
        }
    })();
    return users;
}

module.exports = {
    getAllUsers: getAllUsers
}