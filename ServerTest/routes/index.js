var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('HomePage');
});

/* GET login page. */
router.get('/inserisciAnnuncio', function (req, res, next) {
  res.render('InserisciAnnuncio');
});

module.exports = router;