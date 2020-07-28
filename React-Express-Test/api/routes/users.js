var createError = require('http-errors');
var express = require('express');
var router = express.Router();

// Crypto, configurazione e middleware per il database
const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/*
// Libreria Passport
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

// Specifica, solo durante l'autenticazione, quali informazioni devono essere conservate nella sessione
passport.serializeUser(function (user, done) {
  console.log("Serialized")
  done(null, user.id);
});

// Invocato ad ogni richiesta da passport.session
passport.deserializeUser((user, done) => {
  console.log("Deserialized")
  done(null, { id: user.id });
});

// Passport Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async function (email, password, done) {

    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

      await withTransaction(db, async () => {
        // inserimento utente
        results = await db.query('SELECT * FROM `utenti`\
        WHERE email = ?', [
          email
        ])
          .catch(err => {
            throw err;
          });

        if (results.length == 0) {
          console.log('Utente non trovato!');
          return done(null, false, { message: 'Utente non trovato' });
        } else {
          let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
          pwdhash.update(password); // cifriamo la password
          let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

          if (encpwd != results[0].password) {
            // password non coincidenti
            console.log('Password errata!');
            return done(null, false, { message: 'Password errata' });
          } else {
            console.log('Utente autenticato');

            console.log('Dati utente:');
            console.log(results[0]);

            return done(null, results[0]);
          }
        }
      });
    } catch (err) {
      console.log(err);
      next(createError(500));
    }
  }
));

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.send(req.session);
});*/


// La rotta /users è vietata
router.get('/', function (req, res, next) {
  next(createError(403));
});

// Registrazione Utente
router.post('/signUp', registrazione);

// Login Utente
router.post('/login', autenticazione);

// Diventa Host
router.post('/diventaHost', diventaHost)


// middleware di registrazione
async function registrazione(req, res, next) {
  // istanziamo il middleware
  const db = await makeDb(config);
  let results = {};
  try {
    // generazione della password cifrata con SHA512
    results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.user.pass])
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
          req.body.user.email,
          encpwd,
          false
        ]
      ]
    ])
      .catch(err => {
        throw err;
      });

    console.log(results);
    console.log(`Utente ${req.body.user.email} inserito!`);
    res.send("Registrazione Effettuata");
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
        req.body.user.email
      ])
        .catch(err => {
          throw err;
        });

      if (results.length == 0) {
        console.log('Utente non trovato!');
        next(createError(404, 'Utente non trovato'));
      } else {
        let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
        pwdhash.update(req.body.user.password); // cifriamo la password
        let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

        if (encpwd != results[0].password) {
          // password non coincidenti
          console.log('Password errata!');
          next(createError(403, 'Password errata'));
        } else {
          console.log('Utente autenticato');
          console.log('Dati utente:');
          console.log(results[0]);

          let datiUtente = { id: results[0].id, host: results[0].host }

          res.send(datiUtente);
        }
      }
    });
  } catch (err) {
    console.log(err);
    next(createError(500));
  }
}

async function diventaHost(req, res, next) {

  // istanziamo il middleware
  const db = await makeDb(config);
  let results = {};
  try {

    await withTransaction(db, async () => {
      // inserimento utente
      results = await db.query('UPDATE utenti SET host = ?\
        WHERE id = ?', [
        1,
        req.body.id
      ])
        .catch(err => {
          throw err;
        });

      if (results.length == 0) {
        console.log('Utente non trovato!');
        next(createError(404, 'Utente non trovato'));
      } else {

        console.log('Utente è diventato Host');
        console.log('Results:');
        console.log(results);

        res.send('Utente è diventato Host');
      }
    });
  } catch (err) {
    console.log(err);
    next(createError(500));
  }
}

module.exports = router;