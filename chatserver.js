var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var numCurrentUsers = 0;
var userIds = {};

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});
app.get('/userlist', function(req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(JSON.stringify(userIds, null, 3));
});
 
io.on('connection', function(socket) {
   console.log('user '+JSON.stringify(socket.id)+' connected');
   io.emit('userCount', ++numCurrentUsers);
   userIds[socket.id] = '';
   
   socket.on('disconnect', function() {
      console.log('user '+socket.id+' has left');
      io.emit('userCount', --numCurrentUsers);
      delete userIds[socket.id];
   });
   
   socket.on('chat message', function(msg) {
      
      if (userIds[socket.id] != '') {
         io.emit('chat message', userIds[socket.id] +': '+ msg);
         console.log('message: '+ '['+userIds[socket.id]+']' + msg);
      }
      else {
         userIds[socket.id] = msg;
         console.log(msg + ' has joined the conversation');
         io.emit('chat message', msg + ' has joined the conversation');
      }
   });
});
 
http.listen(3000, function() {
   console.log('listening on *:3000');
   console.log(__dirname);
});
 
