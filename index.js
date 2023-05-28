// Use the dotenv package, to create environment variables

// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000

// Import express, and create a server

// Require morgan and body-parser middleware

// Have the server use morgan with setting 'dev'

// Import cors 
// Have the server use cors()

// Have the server use bodyParser.json()

// Have the server use your api router with prefix '/api'

// Import the client from your db/index.js

// Create custom 404 handler that sets the status code to 404.

// Create custom error handling that sets the status code to 500
// and returns the error as an object


// Start the server listening on port PORT
// On success, connect to the database
const PORT = process.env.PORT || 3000
const express = require('express');
const server = express();
const morgan = require('morgan');
const cors = require('cors');
const { client } = require('./db');
server.use(morgan('dev'));
server.use(cors());

server.use(express.json())
const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use('*', (req, res, next)=>{
    res.status(404).send({message:"Request failed with status code 404"});
})

server.use( (error, req, res, next)=>{
    res.status(500).send({message:"Request failed with status code 500"});
})

server.listen(PORT, () => {
  client.connect();
  console.log('The server is up on port', PORT)
});

