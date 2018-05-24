const axios = require('axios');

exports.get = async () => {
  const weather = await axios.get('http://api.openweathermap.org/data/2.5/find?q=copenhagen,dk&units=metric&APPID=c8f0374014e29861179c08a425ef9f9f');
  try {
    const currentTemp = weather.data.list[0].main.temp
    const currentConditions = weather.data.list[0].weather[0].main
    const conditions = {temp: currentTemp.toFixed(0), conditions: currentConditions}
    return conditions;
  } catch(error) {
    const conditions = {temp: 20, conditions: 'Clear'}
    return conditions;
  }
};