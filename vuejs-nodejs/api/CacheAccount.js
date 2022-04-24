const Promise = require('bluebird');
const database = require('./database/DbSqLite');

var Users;

function getAllUsers() {
    return new Promise((resolve) => {
        if(!Users) {
            database.getAllUsers().then(rows => {
                Users = rows;
                resolve(Users, 'Database')
            });
        } else { resolve(Users, 'Cache') }
    });
}

function findUser(id) {
    return new Promise((resolve) => {
        getAllUsers().then(users => {
            const user = users.find(u => u.Id == id);
            resolve(user)
        });
    });
}
function insertUser(user) {

}

module.exports = {
    getAllUsers: getAllUsers,
    findUser: findUser,
    insertUser: insertUser
}