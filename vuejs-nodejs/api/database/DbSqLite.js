const Account = require('./DbAccount')
const Project = require('./DbProject')

module.exports = {
    getAllUsers: Account.getAllUsers,
    getUser: Account.getUser,
    insertUser: Account.insertUser,

    getProjects: Project.getProjects,
    insertProjectGroup: Project.insertProjectGroup,
    getProjectGroups: Project.getProjectGroups
}