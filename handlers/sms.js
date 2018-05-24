const axios = require('axios');
const qs = require('query-string');


exports.send = async (phoneNumber, message) => {
  axios.post('http://smses.io/api-send-sms.php', qs.stringify({
    mobile: phoneNumber,
    message: message,
    apiToken: process.env.SMS_TOKEN
  }))
    .then(res => {
      console.log(res.data);
    })
}