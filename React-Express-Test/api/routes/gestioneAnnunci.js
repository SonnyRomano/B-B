var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /gestioneAnnunci è vietata */
router.get('/', function (req, res, next) {
    next(createError(403));
});

/*router.get('/inserisciAnnuncio', function (req, res, next) {
    res.send("Ciao");
});*/

/* Inserimento Annuncio */
router.post('/inserisciAnnuncio', inserisciAnnuncio);

/* Ricerca Annunci */
router.post('/ricercaAnnunci', ricercaAnnunci);

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
                    req.body.annuncio.citta,
                    req.body.annuncio.indirizzo,
                    req.body.annuncio.n_bagni,
                    req.body.annuncio.n_posti
                ]
            ]
        ])
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Annuncio inserito!`);
        res.send("Annuncio inserito");
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// middleware di ricerca
async function ricercaAnnunci(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT * FROM `annunci`\
            WHERE citta = ? AND n_posti >= ?', [
                req.body.ricerca.citta,
                req.body.ricerca.n_ospiti
            ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log(`Annunci a ${req.body.citta_r} non trovati!`);
                next(createError(404, `Annunci a ${req.body.citta_r} non trovati!`));
            } else {
                console.log('Annunci Trovati');
                console.log(results);
                res.send(results);
            }
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

module.exports = router;
