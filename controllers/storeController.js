const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const Weather = require('../handlers/weather');

exports.addStore = async (req, res) => {
  const weather = await Weather.get();
  res.render('editStore', {title: 'Add Store', weather});
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}!`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const weather = await Weather.get();
  const stores = await Store.find();
  res.render('stores', {title: 'Stores', weather, stores});
};

exports.getStoresApi = async (req, res) => {
  const stores = await Store.find();
  res.json(stores);
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id: req.params.id});
  res.render('editStore', {title: `Edit ${store.name}`, store});
};

exports.updateStore = async (req, res) => {
  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true, // return the updated store
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated ${store.name}! <a href="/stores/${store.slug}">View store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};