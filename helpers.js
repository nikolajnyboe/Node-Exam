const fs = require('fs');

exports.moment = require('moment');
exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.siteName = `Store Front`;

exports.menu = [
  { slug: '/stores', title: 'Stores', icon: 'store', },
  { slug: '/add', title: 'Add', icon: 'add', },
  { slug: '/chat', title: 'Chat', icon: 'pencil', }
];
