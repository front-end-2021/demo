require('dotenv').config({ path: 'local.env' })
const env = require('@ltv/env')
const express = require('express');
const app = express(),
      bodyParser = require("body-parser"),
      port = env.int('SERVER_PORT', 8002);

//app.use(cors())

app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/my-app'));

app.get('/', (req,res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});