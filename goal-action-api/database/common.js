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
function getColMain(main, newId) {
    let columns = `Id, Name`
    let values = `'${newId}', '${main.Name}'`
    if (main.Start) {
        columns += `, Start`
        values += `, '${main.Start}'`
    }
    if (main.End) {
        columns += `, End`
        values += `, '${main.End}'`
    }
    if (main.Description) {
        columns += `, Description`
        values += `, '${main.Description}'`
    }
    if (main.Budget) {
        columns += `, Budget`
        values += `, ${main.Budget}`
    }
    return {
        Columns: columns, Values: values
    }
}
const insertIntoSub = `INSERT INTO ${tableSub}(Id, ParentId, Name, Description, Start, End, IsDone, Budget)`
const deleteSub = `DELETE FROM ${tableSub} WHERE Id IN (
    SELECT s.Id FROM ${tableSub} as s
    INNER JOIN ${tableMain} as m ON m.Id = s.ParentId
    WHERE m.Id=(?) )`
const insertIntoAct = `INSERT INTO ${tableAction}(Id, ParentId, Name, Description, Start, End, IsDone, ExpectCost, TrueCost)`
function selectAction(mid) {
    const slctSub = `(SELECT Id AS ParentId FROM ${tableSub} WHERE ParentId = '${mid}')`
    return `SELECT * FROM ${tableAction} Where ParentId IN ${slctSub}`
}
const deleteAction = `DELETE FROM ${tableAction} WHERE Id IN (
    SELECT a.Id FROM ${tableAction} AS a
    INNER JOIN ${tableSub} AS s ON s.Id = a.ParentId
    INNER JOIN ${tableMain} AS m ON m.Id = s.ParentId
    WHERE m.Id=(?) )`
module.exports = {
    dbName: dbName,
    tableMain: tableMain,
    tableSub: tableSub,
    tableAction: tableAction,
    getColSub: getColSub,
    getColMain: getColMain,
    insertIntoSub: insertIntoSub,
    deleteSub: deleteSub,
    insertIntoAction: insertIntoAct,
    selectAction: selectAction,
    deleteAction: deleteAction,
}