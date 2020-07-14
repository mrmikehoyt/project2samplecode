//anything regarding users is in here
const users = [];

// Join user to chat
//add user to array and return it
//each user needs id username room
function userJoin(id, username, room) {
  const user = { id, username, room };
//adds the user to user array
  users.push(user);
//returns user
  return user;
}

// Get current user
//we get user by  its id 
//find method high order array method takes arrow function, we take out id that's equal to id passed in 
//returning array , each user pick out id equals to id passed in
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
//this removes user from array
//this finds if user.id === id 
//index !== because if it is not found it returns -1
//line 32 returns the user array wihtout the user 
//were taking out 1 , splicing 1

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    //we have [0] so we do not return entire array only user index
    return users.splice(index, 1)[0];
  }
}

// Get room users
//this gets the users of the room
//for each user we only return user.room for room thats passed in
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}
//we need to export it so we can bring into server js and use them in server js
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
