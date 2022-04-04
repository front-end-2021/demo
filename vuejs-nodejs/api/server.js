const database = require('./database/DbSqLite');
database.InitDb();

require('dotenv').config({ path: 'local.env' });
const env = require('@ltv/env');

var cors = require('cors');
const appExp = require('./appExpress');
const app = appExp.App,
      port = env.int('SERVER_PORT', 8001);

const jwtKey = appExp.createToken('dainb', 'abc123');

var users = []; // getUsers();
app.get('/api/users', cors(appExp.getCorsOptions()), function (req, res, next) {
  console.log('api/users called!!!!!!!', jwtKey);
  database.getAllUsers().then(rows => {
    users = rows;

    res.json({
      key: jwtKey,
      data: encrypData(users)
    });
    next();
  });
});

app.get('/api/user', cors(appExp.getCorsOptions()), function (req, res, next) {  
  const query = req.query;
  const token = query.token;
  if(token != jwtKey) return;
  console.log('api/user called', query);
  const id = parseInt(query.id);
  res.json({
    data: users.find(u => u.Id == id)
  });
});

app.post('/api/user', cors(appExp.getCorsOptions()), (req, res) => {
  const user = req.body.user;
  //user.id = Math.floor(Math.random() * 100);
  console.log('Adding user:::::', user);
  const id = database.insertUser(user);
  user.Id = id;
  users.push(user);
  res.json(user);
});

app.get('/', (req,res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

function encrypData(dUsrs) {
  const a = JSON.parse(JSON.stringify(dUsrs));
  a.forEach(u => {
    u.FirstName = 'N/A';
    u.Email = '***';
  });
  return a;
}