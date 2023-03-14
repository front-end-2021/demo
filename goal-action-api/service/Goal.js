const dbGoal = require('../database/GoalQuery')
const cors = require('cors')

//http://localhost:8001/api/mains
function getAllMains(app, corOptions) {
    app.get(`/api/mains`, cors(corOptions),
        (req, res, next) => {
            dbGoal.getMainSubGoals(true).then(rows => {
                res.json({ data: rows });
                next()
            })
        }
    )
}
//http://localhost:8001/api/main?id=6931cc40-4c1c-42f4-9a0a-a1620d2c6fb3
function getMainById(app, corOptions) {
    app.get('/api/main', cors(corOptions),
        (req, res) => {
            const query = req.query;
            const id = query.id;
            dbGoal.getMainSubBy(id, true).then(row => {
                res.json({ data: row })
            })
        }
    )
}
//http://localhost:8001/api/goal/6931cc40-4c1c-42f4-9a0a-a1620d2c6fb3
function updateGoal(app, corOptions) {
    app.put('/api/goal/:id', cors(corOptions),
        (req, res, next) => {
            const main = req.body.params;
            const id = req.params.id
            dbGoal.updateGoal(id, main).then(n => {
                res.json(`update main ${id}`)
                next();
            })
        }
    )
}
//http://localhost:8001/api/allsub
function getAllSubs(app, corOptions) {
    app.get(`/api/allsub`, cors(corOptions),
        (req, res, next) => {
            dbGoal.getMainSubGoals(false).then(rows => {
                res.json({ data: rows });
                next()
            })
        }
    )
}
//http://localhost:8001/api/subs?mainid=6931cc40-4c1c-42f4-9a0a-a1620d2c6fb3
function getSubsByMainId(app, corOptions) {
    app.get(`/api/subs`, cors(corOptions),
        (req, res, next) => {
            const { mainid } = req.query
            dbGoal.getSubsByMainId(mainid).then(rows => {
                res.json({ data: rows });
                next()
            })
        }
    )
}
//http://localhost:8001/api/sub?id=1305af68-eb1d-452b-aea7-3e669f5ab9f5
function getSubById(app, corOptions) {
    app.get('/api/sub', cors(corOptions),
        (req, res) => {
            const query = req.query;
            const id = query.id;
            dbGoal.getMainSubBy(id).then(row => {
                res.json({ data: row })
            })
        }
    )
}

// { Name: string, Description: string, Start: string, End: string, Budget: number}
function insertMain(app, corOptions) {
    app.post('/api/main', cors(corOptions),
        (req, res, next) => {
            const goal = req.body.params;
            dbGoal.insertNewMain(goal).then(newId => {
                res.json(newId)
                next()
            })
        }
    )
}
// {ParentId: string, Name: string, Description: string, Start: string, End: string, Budget: number}
function insertSub(app, corOptions) {
    app.post('/api/sub', cors(corOptions),
        (req, res, next) => {
            const sub = req.body.params;
            dbGoal.insertNewSub(sub).then(newId => {
                res.json(newId)
                next()
            })
        }
    )
}
//http://localhost:8001/api/sub/uuid
function deleteSub(app, corOptions) {
    app.delete('/api/sub/:id', cors(corOptions),
        (req, res, next) => {
            const id = req.params.id
            dbGoal.deleteSub(id).then(n => {
                res.json(n)
                next()
            })
        }
    )
}
//http://localhost:8001/api/main/uuid
function deleteMain(app, corOptions) {
    app.delete('/api/main/:id', cors(corOptions),
        (req, res, next) => {
            const id = req.params.id
            dbGoal.deleteMain(id).then(n => {
                res.json(n)
                next()
            })
        }
    )
}
//http://localhost:8001/api/copysub/uuid
function duplicateSub(app, corOptions) {
    app.put('/api/copysub/:id', cors(corOptions),
        (req, res, next) => {
            const { id } = req.params
            dbGoal.duplicateSub(id).then(newSub => {
                res.json(newSub)
                next()
            })
        }
    )
}
//http://localhost:8001/api/copymain/uuid
function duplicateMain(app, corOptions) {
    app.put('/api/copymain/:id', cors(corOptions),
        (req, res, next) => {
            const { id } = req.params
            dbGoal.duplicateMain(id).then(newMain => {
                res.json(newMain)
                next()
            })
        }
    )
}

module.exports = {
    getAllMains: getAllMains,
    getMainById: getMainById,
    insertMain: insertMain,
    updateGoal: updateGoal,
    getAllSubs: getAllSubs,
    getSubsByMainId: getSubsByMainId,
    getSubById: getSubById,
    insertSub: insertSub,
    deleteSub: deleteSub,
    deleteMain: deleteMain,
    duplicateSub: duplicateSub,
    duplicateMain: duplicateMain,
}