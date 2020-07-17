var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /gestioneAnnunci è vietata */
router.get('/', function (req, res, next) {
    next(createError(403));
});

/* Inserimento Annuncio */
router.post('/inserisciAnnuncio', inserisciAnnuncio);

// middleware di Inserimento Annuncio
async function inserisciAnnuncio(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        results = await db.query('INSERT INTO `annunci` \
          (citta, indirizzo, n_bagni, n_posti) VALUES ?', [
            [
                [
                    req.body.citta,
                    req.body.indirizzo,
                    req.body.n_bagni,
                    req.body.n_posti
                ]
            ]
        ])
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Annuncio inserito!`);
        res.render('index', { title: 'Annuncio Inserito' });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

module.exports = router;
