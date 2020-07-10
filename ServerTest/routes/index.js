var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('HomePage');
});

/* GET login page. */
router.get('/accedi', function (req, res, next) {
  res.render('Login');
});

/* GET registration page. */
router.get('/registrati', function (req, res, next) {
  res.render('registration', { title: 'Registrazione' });
});

module.exports = router;