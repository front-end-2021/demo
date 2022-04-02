require('dotenv').config({ path: 'local.env' });
const jwt = require('jsonwebtoken');
const env = require('@ltv/env');
const express = require('express');
var cors = require('cors');
const randomId = require('random-id');
const app = express(),
      bodyParser = require("body-parser"),
      port = env.int('SERVER_PORT', 8001);

//app.use(cors())

const users = getUsers();

app.use(bodyParser.json());
const workingDir = process.env.WORKING_DIR;
app.use(express.static(process.cwd() + workingDir));

app.get('/api/users', cors(getCorsOptions()), function (req, res, next) {
  const jwtKey = createToken('dainb', 'abc123');
  console.log('api/users called!!!!!!!', jwtKey);
  res.json({
    key: jwtKey,
    data: users
  });
});

app.post('/api/user', cors(getCorsOptions()), (req, res) => {
  const user = req.body.user;
  user.id = randomId(10);
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
    origin: 'http://localhost:8082',
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
      id: "1",
      firstName: "first1",
      lastName: "last1",
      email: "abc@gmail.com"
    },
    {
      id: "2",
      firstName: "first2",
      lastName: "last2",
      email: "abc@gmail.com"
    },
    {
      id: "3",
      firstName: "first3",
      lastName: "last3",
      email: "abc@gmail.com"
    }
  ];
}