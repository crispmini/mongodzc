var mongoose = require('mongoose');

var UnitSchema = new mongoose.Schema({
  faction: String,
  name: String,
  a: Number,
  mv: Number,
  cm: String,
  dp: Number,
  pts: Number,
  type: String,
  category: String,
  ss: { min: Number, max: Number, isSet: Boolean, sizes: [] },
  coh: String,
  specrules: String,
  weapons: String,
});

module.exports = mongoose.model('Unit', UnitSchema);