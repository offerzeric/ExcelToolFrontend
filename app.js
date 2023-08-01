const axios = require('axios');
const express = require('express');
const cors = require('cors');
const url = require('url');
const path = require('path');


/**
 * environment setting
 */
var app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(express.static('node_modules'))
app.use(express.static('app/css'))
app.use(express.static('app/js'))
app.use(express.static('app/static'))




/**
 * initial entrypoint
 */
app.get('/424Code', (req, res) => {
  let currentDirPath = __dirname
  console.log(currentDirPath)
  res.sendFile(currentDirPath+"/app/html/do424Code.html")
})


/**
 * main
 */
var port = process.env.PORT || 9091;
// app.use(express.static('static'));
var server = app.listen(port,()=>{
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at http://%s:%s", host, port)
})


module.exports = { axios }
