const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const Weather = require('../handlers/weather');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({message: 'That file type is not allowed!'}, false);
    }
  }
};

exports.addStore = async (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`; // generate filename

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO); // resize photo
  await photo.write(`./public/uploads/${req.body.photo}`); // save photo

  next();
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}!`);
  res.redirect(`/stores/${store._id}`);
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
  req.flash('success', `Successfully updated ${store.name}! <a href="/stores/${store._id}">View store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreById = async (req, res, next) => {
  const store = await Store.findOne({_id: req.params.id});
  if (!store) return next();
  res.render('store', {title: store.name, store});
}