const redis = require('redis');
const client = redis.createClient(6379);

client.on('error', (err) => {
    console.log("Error " + err)
});

const usersRedisKey = 'account:users';

function getAllUsers() {
    return client.get(usersRedisKey, (err, users) => {
        if(users) {
            return {
                source: 'cache',
                data: JSON.parse(users)
            }
        }
        
    });
}