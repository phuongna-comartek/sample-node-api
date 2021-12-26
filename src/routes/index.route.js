/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright IBM Corporation 2020
*/

const express = require('express');
const cars = require('./cars.route');
const accounts = require('./accounts.route');
const swagger = require('./swagger.route');
const child_process = require('child_process')
const promisify = require('util').promisify;
const exec = promisify(child_process.exec)
const router = express.Router();
var bodyParser = require('body-parser')

const BASE_URL = 'http://192.53.173.14:8080'
router.use(bodyParser.json())
router.post('/login' , async (req, res ) => {
  const {username, password} = req.body
  try {
    
  const {stdout} = await exec(`
    curl --location --request POST 'http://localhost:8080/api/public/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username": "${username}",
        "password": "${password}"
    }'
  `)
  // console.log(stdout)
  res.send(JSON.parse(stdout))
  } catch (error) {
   res.send(JSON.parse(error.stdout)) 
  }
})

router.get('*',async (req, res) => {
  console.log(req.url)
  try {
    
    const cmd = ` curl --location '${BASE_URL}${req.url}' --header 'Content-Type: application/json' `
  console.log("executing...",cmd);
    const {stdout} = await exec(cmd)
    res.send(JSON.parse(stdout));

  } catch (error) {
   res.send("crashed \n" + error.stdout) 
  }
  // res.send('Sample Node API Version1');
});
router.get('/health', (req, res) => {
  const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
  };
  res.send(JSON.stringify(healthcheck));
});

module.exports = router;