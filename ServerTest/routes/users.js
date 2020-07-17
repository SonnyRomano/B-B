var createError = require('http-errors');
var express = require('express');
var router = express.Router();

// carichiamo crypto, la configurazione e il middleware per il database
const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /users è vietata */
router.get('/', function (req, res, next) {
  next(createError(403));
});

/* Registrazione Utente */
router.post('/signUp', registrazione);

/* Login Utente */
router.post('/login', autenticazione);


// middleware di registrazione
async function registrazione(req, res, next) {
  // istanziamo il middleware
  const db = await makeDb(config);
  let results = {};
  try {
    // generazione della password cifrata con SHA512
    results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.pass])
      .catch(err => {
        throw err;
      });

    let encpwd = results[0].encpwd;
    console.log('Password cifrata');
    console.log(results);

    let id_utente = results.insertId;

    results = await db.query('INSERT INTO `utenti` \
        (id, email, password) VALUES ?', [
      [
        [
          id_utente,
          req.body.email,
          encpwd
        ]
      ]
    ])
      .catch(err => {
        throw err;
      });

    console.log(results);
    console.log(`Utente ${req.body.email} inserito!`);
    res.render('index', { title: 'Registrazione effettuata' });
  } catch (err) {
    console.log(err);
    next(createError(500));
  }
}

// middleware di autenticazione
async function autenticazione(req, res, next) {
  // istanziamo il middleware
  const db = await makeDb(config);
  let results = {};
  try {

    await withTransaction(db, async () => {
      // inserimento utente
      results = await db.query('SELECT * FROM `utenti`\
          WHERE email = ?', [
        req.body.email
      ])
        .catch(err => {
          throw err;
        });

      if (results.affectedRows == 0) {
        console.log('Utente non trovato!');
        next(createError(404, 'Utente non trovato'));
      } else {
        let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
        pwdhash.update(req.body.pass); // cifriamo la password
        let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

        if (encpwd != results[0].password) {
          // password non coincidenti
          console.log('Password errata!');
          next(createError(403, 'Password errata'));
        } else {
          console.log('Utente autenticato');
          console.log(results);
          // recupero dello user id
          let id_utente = results[0].id;

          console.log('Dati utente:');
          console.log(results[0]);
          res.redirect('/');
        }
      }
    });
  } catch (err) {
    console.log(err);
    next(createError(500));
  }
}

module.exports = router;