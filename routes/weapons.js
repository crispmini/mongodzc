var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Weapon = require('../models/Weapon.js');

/* GET /weapons listing. */
router.get('/', function(req, res, next) {
  Weapon.find(function (err, weapons) {
    if (err) return next(err);
    res.json(weapons);
  });
});

/* POST /weapons */
router.post('/', function(req, res, next) {
  Weapon.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /weapons/id */
router.get('/:id', function(req, res, next) {
  Weapon.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /weapons/:id */
router.put('/:id', function(req, res, next) {
  Weapon.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /weapons/:id */
router.delete('/:id', function(req, res, next) {
  Weapon.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;