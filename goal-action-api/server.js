const dbGoal = require('./database/GoalQuery')
const dbAction = require('./database/ActionQuery')
require('dotenv').config({ path: 'local.env' })
//const env = require('@ltv/env')
var cors = require('cors')
const AppExpress = require('./AppExpress')
const app = AppExpress.App,
    port = 8001;

//http://localhost:8001/api/mains
app.get(`/api/mains`,
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        dbGoal.getMainSubGoals(true).then(rows => {
            res.json({ data: rows });
            next()
        })
    }
)
app.get(`/api/subs`,
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        dbGoal.getMainSubGoals(false).then(rows => {
            res.json({ data: rows });
            next()
        })
    }
)
app.get(`/api/actions`,
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        dbAction.getActions().then(rows => {
            res.json({ data: rows });
            next()
        })
    }
)
//http://localhost:8001/api/main?id=6931cc40-4c1c-42f4-9a0a-a1620d2c6fb3
app.get('/api/main',
    cors(AppExpress.getCorsOptions()),
    (req, res) => {
        const query = req.query;
        const id = query.id;
        dbGoal.getMainSubBy(id, true).then(row => {
            res.json({ data: row })
        })
    }
)
app.get('/api/sub',
    cors(AppExpress.getCorsOptions()),
    (req, res) => {
        const query = req.query;
        const id = query.id;
        dbGoal.getMainSubBy(id).then(row => {
            res.json({ data: row })
        })
    }
)
app.get('/api/action',
    cors(AppExpress.getCorsOptions()),
    (req, res) => {
        const query = req.query;
        const id = query.id;
        dbAction.getActionBy(id).then(row => {
            res.json({ data: row })
        })
    }
)
// {Name: string, Description: string, Start: string, End: string, Budget: number}
app.post('/api/main',
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        const goal = req.body;
        dbGoal.insertNewMain(goal)
        res.json('insert goal')
        next();
    }
)
// {ParentId: string, Name: string, Description: string, Start: string, End: string, Budget: number}
app.post('/api/sub',
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        const sub = req.body;
        dbGoal.insertNewSub(sub)
        res.json('insert sub')
        next();
    }
)
// {ParentId: string, Name: string, Description: string, Start: string, End: string, ExpectCost: number, TrueCost: number}
app.post('/api/action',
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        const action = req.body;
        dbAction.insertNewAction(action)
        res.json('insert action')
        next();
    }
)
//http://localhost:8001/api/goal/6931cc40-4c1c-42f4-9a0a-a1620d2c6fb3
app.put('/api/goal/:id',
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        const main = req.body;
        const id = req.params.id
        dbGoal.updateGoal(id, main).then(n => {
            res.json(`update main ${id}`)
            next();
        })
    }
)
app.put('/api/action/:id',
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        const action = req.body;
        const id = req.params.id
        dbAction.updateAction(id, action).then(n => {
            res.json(`update action ${id}`)
            next();
        })
    }
)
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/index.html');
})
app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
})