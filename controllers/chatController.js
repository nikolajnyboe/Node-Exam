const Weather = require('../handlers/weather');

exports.start = async (req, res) => {
  const weather = await Weather.get();
  res.render('chat', {title: 'Chat', weather});
};