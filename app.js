/* global require:true, console:true, process:true, __dirname:true */
'use strict'

// Example run command: `node app.js 9000 6380 true`; listen on port 9000, connect to redis on 6380, debug printing on.

var express     = require('express')
  , http        = require('http')
  , levelup     = require('level')
  , leveldb
  , port        = process.argv[2] || 8000
  , rport       = process.argv[3] || 6379
  , debug       = process.argv[4] || null

// Database setup
leveldb = levelup('./lexperimentrdb')
console.log("Creating levelup database.")
console.log(leveldb.get('hshrokd0', function( err ) {}))


//redisClient.on('connect', function() {
//  console.log('Connected to redis.')
//})

// Data handling
var save = function save(d) {
  leveldb.put(d.postId, d)
  if ( debug )
    console.log('saved to leveldb: ' + d.postId + ', at: ' + (new Date()).toString())
  //redisClient.hmset(d.postId, d)
  //if( debug )
    //console.log('saved to redis: ' + d.postId +', at: '+ (new Date()).toString())
}

// Server setup
var app = express()
app.use(express.bodyParser())
app.use(express.static(__dirname + '/public'))

// Handle POSTs from frontend
app.post('/', function handlePost(req, res) {
  // Get experiment data from request body
  var d = req.body
  // If a postId doesn't exist, add one (it's random, based on date)
  if (!d.postId) d.postId = (+new Date()).toString(36)
  // Add a timestamp
  d.timestamp = (new Date()).getTime()
  // Save the data to our database
  save(d)
  // Send a 'success' response to the frontend
  res.send(200)
})

// Create the server and tell which port to listen to
http.createServer(app).listen(port, function (err) {
  if (!err) console.log('Listening on port ' + port)
})
