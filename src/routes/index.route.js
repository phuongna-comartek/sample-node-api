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
const { stdout } = require('process');
const exec = promisify(child_process.exec)
const router = express.Router();

router.use('/cars', cars);
router.use('/accounts', accounts);
router.use('/', swagger);
router.post('/login' , async (req, res ) => {
  console.log( '============================================== ');
  const {stdout} = await exec(`
    curl --location --request POST 'http://localhost:8080/api/public/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username": "admin",
        "password": "admin123"
    }'
  `)
  // console.log(stdout)
  res.send(stdout)
})

router.get('/', (req, res) => res.send('Sample Node API Version1'));
router.get('/health', (req, res) => {
  const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
  };
  res.send(JSON.stringify(healthcheck));
});

module.exports = router;