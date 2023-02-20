require('dotenv').config({ path: 'local.env' });
const cors = require('cors');
const express = require('express');
const app = express(),
    bodyParser = require("body-parser"),
    corsOrigin = "*"//process.env.CORS_ORIGIN;

const workingDir = process.env.WORKING_DIR;

app.use(bodyParser.json()); app.use(cors());
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

function getCorsOptions() {
    return {
        origin: corsOrigin,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
}

// const jwt = require('jsonwebtoken');
// function createToken(user, email) {
//     const token = jwt.sign(
//         { data: `user=${user}-email=${email}` },
//         process.env.TOKEN_KEY,
//         {
//             expiresIn: "5h",
//         }
//     );
//     return token;
// }

module.exports = {
    App: app,
    getCorsOptions: getCorsOptions,
    //createToken: createToken
}