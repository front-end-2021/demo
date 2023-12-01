
function getListGoal() {
    const listMain = []
    for (let Id = 1; Id < MaxId; Id++) {
        const Start = getRandomDate(getRandomInt(0, 7))
        let Name = getRandomTask()

        listMain.push({
            Id, Name,
            Status: GaStatus.Default,
            Start, End: getRandomDate(3, Start)
        })
    }
    return listMain
}

function getListAction() {
    const listA = []
    for (let Id = 1; Id < MaxId * 3; Id++) {
        const Start = getRandomDate(getRandomInt(0, 7))
        listA.push({
            Id, Name: getRandomTask(),
            Status: GaStatus.Default,
            Start, End: getRandomDate(3, Start)
        })
    }
    return listA
}

function getListUser() {
    const listU = []
    for (let Id = 1; Id < 12; Id++) {
        const Name = getRandomFName(Id),
            LastName = getRandomLName(Id)
        listU.push({
            Id, Name, LastName,
            Email: getEmail(Name, LastName)
        })
    }
    return listU
}
function getMapsGoalAction(goals, actions) {
    const lstMap = []
    const mLen = goals.length
    const aLen = actions.length
    const aPerGoal = Math.floor(aLen / mLen)
    let aa = 0
    for (let ii = 0; ii < mLen; ii++) {
        const goal = goals[ii]
        const item = {
            GoalId: goal.Id, ActionIds: []
        }
        let size = aa + getRandomInt(0, aPerGoal + 1)
        if (ii == mLen - 1) size = aLen - 1

        for (aa; aa <= size; aa++) {
            const action = actions[aa]
            if(!action) continue
            item.ActionIds.push(action.Id)
        }
        lstMap.push(item)
    }
    return lstMap
}