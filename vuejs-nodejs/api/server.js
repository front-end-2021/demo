require('dotenv').config({ path: 'local.env' });
const jwt = require('jsonwebtoken');
const env = require('@ltv/env');
const express = require('express');
var cors = require('cors');
const app = express(),
      bodyParser = require("body-parser"),
      port = env.int('SERVER_PORT', 8001),
      corsOrigin = process.env.CORS_ORIGIN;

const users = getUsers();
const workingDir = process.env.WORKING_DIR;
//app.use(cors());
app.use(bodyParser.json());
app.use(express.static(process.cwd() + workingDir));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
const jwtKey = createToken('dainb', 'abc123');

app.get('/api/users', cors(getCorsOptions()), function (req, res, next) {
  console.log('api/users called!!!!!!!', jwtKey);
  res.json({
    key: jwtKey,
    data: encrypData(users)
  });
});

app.get('/api/user', cors(getCorsOptions()), function (req, res, next) {  
  const query = req.query;
  const token = query.token;
  if(token != jwtKey) return;
  console.log('api/user called', query);
  const id = parseInt(query.id);
  res.json({
    data: users.find(u => u.id == id)
  });
});

app.post('/api/user', cors(getCorsOptions()), (req, res) => {
  const user = req.body.user;
  user.id = Math.floor(Math.random() * 100);
  console.log('Adding user:::::', user);
  users.push(user);
  res.json("user addedd");
});

app.get('/', (req,res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

function getCorsOptions(){
  return {
    origin: corsOrigin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
}
function createToken(user, email) {
  const token = jwt.sign(
    { data: `user=${user}-email=${email}` },
    process.env.TOKEN_KEY,
    {
      expiresIn: "5h", 
    }
  );
  return token;
}
function getUsers() {
  return [
    {
      id: 1,
      firstName: "first1",
      lastName: "last1",
      email: "abc@gmail.com"
    },
    {
      id: 2,
      firstName: "first2",
      lastName: "last2",
      email: "def@email.com"
    },
    {
      id: 3,
      firstName: "first3",
      lastName: "last3",
      email: "abc@gmail.com"
    }
  ];
}
function encrypData(dUsrs) {
  const a = JSON.parse(JSON.stringify(dUsrs));
  a.forEach(u => {
    u.firstName = 'N/A';
    u.email = '***';
  });
  return a;
}