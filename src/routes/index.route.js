/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright IBM Corporation 2020
*/

const express = require('express');
const child_process = require('child_process')
const promisify = require('util').promisify;
const exec = promisify(child_process.exec)
const router = express.Router();
var bodyParser = require('body-parser')

// const BASE_URL = 'http://192.53.173.14:8080'
const BASE_URL = 'http://localhost:8080'

router.use(bodyParser.json())
router.post('*' , async (req, res ) => {
  const data = JSON.stringify(req.body)
  console.log("POST" ,req.url)
  try {
    
  const {stdout} = await exec(`
    curl --location --request POST '${BASE_URL}${req.url}' \
    --header 'Content-Type: application/json' \
    --data-raw '${data}'
  `)
  // console.log(stdout)
    res.send(JSON.parse(stdout))
  } catch (error) {
    res.send(JSON.parse(error.stdout)) 
  }
})

router.get('*',async (req, res,next) => {
  if(req.url.includes('privacy.html')){
    console.log(" S === ");
    next()
    return
  }
  try {
    const cmd = `curl '${BASE_URL}${req.url}' --header 'Content-Type: application/json' `
    console.log("GET" ,cmd)
    const {stdout} = await exec(cmd)
    res.send(JSON.parse(stdout));

  } catch (error) {
    console.log(" error ,", JSON.stringify(error, null,2));
   res.send("crashed \n" + error.stdout) 
  }
  // res.send('Sample Node API Version1');
});

module.exports = router;