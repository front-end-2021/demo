require('dotenv').config({ path: 'local.env' })
//const env = require('@ltv/env')
const AppExpress = require('./AppExpress')
const app = AppExpress.App, port = 8001;


const apiGoal = require('./service/Goal')
apiGoal.getAllMains(app, AppExpress.getCorsOptions())
apiGoal.getMainById(app, AppExpress.getCorsOptions())
apiGoal.insertMain(app, AppExpress.getCorsOptions())

apiGoal.updateGoal(app, AppExpress.getCorsOptions())

apiGoal.getAllSubs(app, AppExpress.getCorsOptions())
apiGoal.getSubsByMainId(app, AppExpress.getCorsOptions())
apiGoal.getSubById(app, AppExpress.getCorsOptions())
apiGoal.insertSub(app, AppExpress.getCorsOptions())


const apiAction = require('./service/Action')
apiAction.getAllActions(app, AppExpress.getCorsOptions())
apiAction.getActionsBySubId(app, AppExpress.getCorsOptions())
apiAction.getActionById(app, AppExpress.getCorsOptions())
apiAction.insertAction(app, AppExpress.getCorsOptions())
apiAction.updateAction(app, AppExpress.getCorsOptions())


app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/index.html');
})
app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
})