var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('HomePage');
});

/* GET login page. */
router.get('/inserisciAnnuncio', function (req, res, next) {
  res.render('InserisciAnnuncio');
});

router.get('/paginaRicerca', function (req, res, next) {
  res.render('PaginaRicerca');
});

module.exports = router;