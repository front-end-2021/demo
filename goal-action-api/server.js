const database = require('./database/GoalQuery')
require('dotenv').config({ path: 'local.env' })
//const env = require('@ltv/env')
var cors = require('cors')
const AppExpress = require('./AppExpress')
const app = AppExpress.App,
    port = 8001;

//http://localhost:8001/api/goals
app.get(`/api/goals`,
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        database.getMaingoals().then(rows => {
            res.json({
                data: rows
            });
            next()
        })
    }
)
//http://localhost:8001/api/goal?id=6931cc40-4c1c-42f4-9a0a-a1620d2c6fb3
app.get('/api/goal',
    cors(AppExpress.getCorsOptions()),
    (req, res) => {
        const query = req.query;
        const id = query.id;
        database.getMaingoal(id).then(row => {
            res.json({
                data: row
            })
        })
    }
)
app.post('/api/goal',
    cors(AppExpress.getCorsOptions()),
    (req, res, next) => {
        const goal = req.body;
        database.insertNewMain(goal)
        res.json('insert goal')
        next();
    }
)
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/index.html');
})
app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
})