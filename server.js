const path = require('path');
//used by express under hood, needed for socket.io
const http = require('http');
const express = require('express');
//for chat
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
//importing functions / modules from utils /users
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
//needed for socket.io
const server = http.createServer(app);
//for chat
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
//this is for the messages.js (format message function) botname is username
const botName = 'ChatCord Bot';

// Run when client connects, listens for connections to chat
io.on('connection', socket => {
  console.log('new websocket connection / client connected')

  socket.on('joinRoom', ({ username, room }) => {
    //we use id of socket. we want room user joins which comes from url same iwth username
    //id we are using is id of socket
    const user = userJoin(socket.id, username, room);
  //because were using rooms socket.join user.room socket.emit welcome message
  //socket.broadcast to.user.room .emit message has joined, and io to user.room emit 
  //room users is under  socket.on join room
  //this joins the room based of the room that was specified url
    socket.join(user.room);

    // Welcome current user message can be called whatever, message welcome to chatcord
    // this is displayed when user joins chat only displayed for one user
    //formatmessage. format is username(botname), message, and than time
    //format message function takes in username and text (botname, welcome to chatcord)
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
    console.log('sending pm')
const pm = 'shh private message'
    io.to(socket.id).emit('private',pm)
    console.log('pm sent')
    // Broadcast when a user connects
    //this emits to everyone except user that is connected 
    // io.emit() broadcasts to all clients
    //broadcast.to(user.room) emits to certain room
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        //cause we have access to user.username we are able to have it say the usersname joined chat
        formatMessage(botName, `${user.username} has joined the chat`)
      );
   
    // Send users and room info
    //this populates when user joins chat because of how it's nested
    //sends only to room user is in . called roomusers 
    io.to(user.room).emit('roomUsers', {
      //room is object of users in the room *user.room
      room: user.room,
      //sends all users in room 
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage that user types in chat box
  socket.on('chatMessage', msg => {
    //this console logs to server message user types in chat
    console.log(msg)
    //gets user by socket.id
    const user = getCurrentUser(socket.id);
    //snds message to room user joined .msg sent from server. msg is only
    //emitted / sent to room user joins and shows the name of the user when messages are sent from user   
    //formatmessage msg ensures that username, time, and text is sent
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  

  // Runs when client disconnects 
  socket.on('disconnect', () => {
    //need to know which user left thats why declaring
    const user = userLeave(socket.id);
    //this checks for user
    if (user) {
      //this emits to all users that user left chat . user.username is user
      //message is what is needed for the user has left the chat to be console logged refer to frontend code because message is being consoled logged in frontend code
      //io.to(user.room) ensures message is only sent to room
      //format message says user has left change 
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      //same as comments under line 59 however this is for if they leave chat
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
