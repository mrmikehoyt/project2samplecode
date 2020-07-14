const moment = require('moment');
//this formats message with username and text 
//this returns username and text and time
//moment is needed for time
//this is used in server js
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
