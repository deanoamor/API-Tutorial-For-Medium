//import config
const baseConfig =  require('./config/base.config');

//import express
const express = require('express')

const app = express();
const port = 3000;
const urlApi = "/api";

//body-parser untuk menghandle input dari raw body
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

//memanggil route pada routes\api.route.js
require('./routes/api.route')(app,urlApi);

//listen
app.listen(port, () => {
    console.log(`server is running on port ${port} and url ${baseConfig.base_url}`);
});

