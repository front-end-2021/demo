const dbName = `GoalAction`
const tableMain = 'Maingoal'
const tableAction = `Action`
const tableSub = 'Subgoal'
function getColSub(sub, newId) {
    let columns = `Id, ParentId, Name`
    let values = `'${newId}', '${sub.ParentId}', '${sub.Name}'`
    if (sub.Start) {
        columns += `, Start`
        values += `, '${sub.Start}'`
    }
    if (sub.End) {
        columns += `, End`
        values += `, '${sub.End}'`
    }
    if (sub.Description) {
        columns += `, Description`
        values += `, '${sub.Description}'`
    }
    if (sub.Budget) {
        columns += `, Budget`
        values += `, ${sub.Budget}`
    }
    return {
        Columns: columns, Values: values
    }
}
module.exports = {
    dbName: dbName,
    tableMain: tableMain,
    tableSub: tableSub,
    tableAction: tableAction,
    getColSub: getColSub
}