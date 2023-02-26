const dbAction = require('../database/ActionQuery')
const cors = require('cors')

//http://localhost:8001/api/allaction
function getAllActions(app, corOptions) {
    app.get(`/api/allaction`, cors(corOptions),
        (req, res, next) => {
            dbAction.getActions().then(rows => {
                res.json({ data: rows });
                next()
            })
        }
    )
}
//http://localhost:8001/api/actions?subid=1305af68-eb1d-452b-aea7-3e669f5ab9f5
function getActionsBySubId(app, corOptions) {
    app.get('/api/actions', cors(corOptions),
        (req, res) => {
            const { subid } = req.query
            dbAction.getActionsBySubId(subid).then(row => {
                res.json({ data: row })
            })
        }
    )
}
//http://localhost:8001/api/action?id=uuid
function getActionById(app, corOptions) {
    app.get('/api/action', cors(corOptions),
        (req, res) => {
            const query = req.query;
            const id = query.id;
            dbAction.getActionBy(id).then(row => {
                res.json({ data: row })
            })
        }
    )
}
// {ParentId: string, Name: string, Description: string, Start: string, End: string, ExpectCost: number, TrueCost: number}
function insertAction(app, corOptions) {
    app.post('/api/action', cors(corOptions),
        (req, res, next) => {
            const action = req.body.params;
            dbAction.insertNewAction(action).then(newId =>{
                res.json(newId)
                next()
            })
        }
    )
}
//http://localhost:8001/api/action/uuid
function updateAction(app, corOptions) {
    app.put('/api/action/:id', cors(corOptions),
        (req, res, next) => {
            const action = req.body.params;
            const id = req.params.id
            dbAction.updateAction(id, action).then(n => {
                res.json(`update action ${id}`)
                next();
            })
        }
    )
}
module.exports = {
    getAllActions: getAllActions,
    getActionById: getActionById,
    insertAction: insertAction,
    updateAction: updateAction,
    getActionsBySubId: getActionsBySubId,
}