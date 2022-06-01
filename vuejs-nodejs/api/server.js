//https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-vue-js-app-with-nodejs-bd86feec1a20
const database = require('./database/DbSqLite');

require('dotenv').config({ path: 'local.env' });
const env = require('@ltv/env');

var cors = require('cors');
const appExp = require('./appExpress');
const app = appExp.App,
      port = env.int('SERVER_PORT', 8001);

const jwtKey = appExp.createToken('dainb', 'abc123');

const Constants = require('./Constants')

// #region user/Account
var users = [];
app.get(Constants.ApiUsersPath, cors(appExp.getCorsOptions()), (req, res, next) => {
  console.log('api/users called!!!!!!!', jwtKey);

  database.getAllUsers().then(rows => {
    users = rows;
    res.json({
      key: jwtKey,
      data: encrypData(users)
    });
    next();
  })
})

app.get(Constants.ApiUserPath, cors(appExp.getCorsOptions()), (req, res) => {  
  const query = req.query;
  const token = query.token;
  if(token != jwtKey) return;
  const id = parseInt(query.id);
  res.json({
    data: users.find(u => u.Id == id)
  })
})

app.post(Constants.ApiUserPath, cors(appExp.getCorsOptions()), (req, res, next) => {
  const user = req.body.user;
  database.insertUser(user).then(newId => {
    user.Id = newId;
    users.push(user);
    console.log('new user id', newId)
    res.json(user)
    next();
  })
})
// endregion

app.get(Constants.ApiProjectGroupsPath, cors(appExp.getCorsOptions()), (req, res, next) => {
  database.getProjectGroups().then(rows => {
    res.json({
      data: rows
    })
    next()
  })
})
app.get(Constants.ApiProjectsPath, cors(appExp.getCorsOptions()), (req, res, next) => {
  database.getProjects().then(rows => {
    res.json({
      data: rows
    })
    next()
  })
})
app.post(Constants.ApiProjectGroupPath, cors(appExp.getCorsOptions()), (req, res, next) => {
  const entry = req.body.projectgroup;
  if(entry.Id < 1) {
    console.log('create project group')
    database.insertProjectGroup(entry).then((status) => {
      res.json({ Status: status })
      next()
    })
  } else {
    console.log('edit project group', req.ip)
    database.editProjectGroup(entry).then(status => {
      res.json({ Status: status })
      next()
    })
  }
})
app.delete(Constants.ApiProjectGroupPath, cors(appExp.getCorsOptions()), (req, res, next) => {
  const entry = req.body;
  console.log('app.delete: ', entry)
  database.deleteProjectGroup(entry.Id).then(status => {
    res.json({ Status: status })
    next()
  })
})

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

function encrypData(dUsrs) {
  const a = JSON.parse(JSON.stringify(dUsrs));    // copy
  a.forEach(u => {
    u.FirstName = 'N/A';
    u.Email = '***';
  });
  return a;
}