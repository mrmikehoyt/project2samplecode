//chatform is needed to send messages update html with messages / chat
const chatForm = document.getElementById('chat-form');
//query selector class , neededed for auto scroll
const chatMessages = document.querySelector('.chat-messages');
//querys id room-name in chat.html needed for outputroom name function
const roomName = document.getElementById('room-name');
//querys id users in chat.html . needed for users name function
const userList = document.getElementById('users');

// Get username and room from URL . this uses qs library which we added  in chat.html under scripts
const { username, room } = Qs.parse(location.search, {
  //this ignores ampersand etc. 
  ignoreQueryPrefix: true
});
//this consoles username and room from url
console.log(username, room);
//we have access to this because we required socket.io in chat.html
const socket = io();

// Join chatroom
//this emits object/ text  username and room under Room Name and Users for example Mike and Javascript (nickname and chatroom name)
socket.emit('joinRoom', { username, room });

// Get room and users
//

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
// Message from server this is related to line 36 socket.emit welcome to chatcord message is event
socket.on('message', message => {
  //console.log displays welcome to chatcord
  console.log(message);
  //function output message 
  outputMessage(message);

  // Scroll down
  //this sets scroll top to whatever height of scroll messages is
  //this brings you down to the bottom message if the chatmessages class is larger
  //than all messages in it 
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text 
  //e.target current element
  //under chat.html input id = msg , since we want value we do .value
  const msg = e.target.elements.msg.value;
  console.log(msg)
  // Emit message that user types in chat to server so it shows up in chat
  socket.emit('chatMessage', msg);

  // Clear input
  //this clears the box where your enter messages after the message has been sent

  e.target.elements.msg.value = '';
  //after message goes away this focus's on empty input
  e.target.elements.msg.focus();
});


// Output message to DOM chat
//because were catching message with socket.on , emit, etc it's getting logged to dom
//message is object, because we want text thats why inner html is being setting as
//message.username, message.time, and message.text . if it is not object object will be displayed instead
function outputMessage(message) {
  const div = document.createElement('div');
//this modifys dom adds mesage div 
  div.classList.add('message');
  //this sets inner html under message div
  //username, time, text is determined in messages.js file. still not 100% clear
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time} </span></p>
  <p class="text">
    ${message.text}
  </p>`;

  //this adds it to the dom under .chat-messages . selects container chat-messages and appends to it
  document.querySelector('.chat-messages').appendChild(div);
}





// Add room name to DOM
//this updates id roomname with room in roomname id
//this shows room in chat
function outputRoomName(room) {
  roomName.innerText = room;
}


// Add users to DOM
//this sets users id innerhtml and populates each user 
//this is done by mapping through user array and for each user
//in array user is displayed in <li></li> html tag
//join is needed because it's an array . dobule quotes in join are needed because
//were turning array into string, output is string
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

