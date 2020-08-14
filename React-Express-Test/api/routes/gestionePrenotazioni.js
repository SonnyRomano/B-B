var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /gestionePrenotazioni è vietata */
router.get('/', function (req, res, next) {
    next(createError(403));
});

/* clienti prenotano annunci */
router.post('/effettuaPrenotazione', effettuaPrenotazione);

/* proprietario visualiza lista prenotazioni pendenti */
router.post('/visualizzaPrenotazioniProprietario', visualizzaPrenotazioniProprietario);


// middleware di Inserimento Annuncio
async function effettuaPrenotazione(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        results = await db.query('INSERT INTO `prenotazioni` \
          (idAnnuncio, idProprietario, idCliente, dateFrom, dateTo, costo, attiva) VALUES ?', [
            [
                [
                    req.body.prenotazione.idAnnuncio,
                    req.body.prenotazione.idProprietario,
                    req.body.prenotazione.idCliente,
                    req.body.prenotazione.dateFrom,
                    req.body.prenotazione.dateTo,
                    req.body.prenotazione.costoTotale,
                    false
                ]
            ]
        ])
            .catch(err => {
                throw err;
            });

        console.log(results.insertId);
        console.log(results);
        console.log(`Prenotazione inserita!`);
        res.send(results);
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// middleware di Inserimento Annuncio
async function visualizzaPrenotazioniProprietario(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT * FROM `prenotazioni`\
            WHERE idProprietario = ?', [
                req.body.idProprietario
            ])
            .catch(err => {
                throw err;
            });

            if (results.length == 0) {
                console.log(`Prenotazioni relative all' ID ${req.body.idProprietario} non trovate!`);
                res.status(403).send(`Spiacenti, non ha richieste pendenti da visualizzare!`);
            } else {
                console.log('Richieste trovate');
                console.log(results);
                res.status(200).send(results);
            }
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

module.exports = router;