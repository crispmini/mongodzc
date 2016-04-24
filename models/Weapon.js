var mongoose = require('mongoose');

var WeaponSchema = new mongoose.Schema({
  faction: String,
  name: String,
  e: Number,
  sh: Number,
  ac: Number,
  rf: Number,
  rc: Number,
  mf: Number,
  arc: String,
  specrules: String,
});

module.exports = mongoose.model('Weapon', WeaponSchema);