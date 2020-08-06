var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /gestionePrenotazioni è vietata */
router.get('/', function (req, res, next) {
    next(createError(403));
});

/* Ricerca Annunci */
router.post('/effettuaPrenotazione', effettuaPrenotazione);


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

// middleware di aggiornamento annuncio
async function aggiornaAnnuncio(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        results = await db.query('UPDATE annunci \
                            SET idProprietario=?,citta=?,cap=?,indirizzo=?,civico=?,dateFrom=?,dateTo=?,n_bagni=?,n_posti=?,\
                            wifi=?,ascensore=?,garage=?,terrazzo=?,descrizione=?,telefono=?,costo=? WHERE idAnnuncio = ? ',
            [
                [req.body.annuncio.idProprietario],
                [req.body.annuncio.citta],
                [req.body.annuncio.cap],
                [req.body.annuncio.indirizzo],
                [req.body.annuncio.civico],
                [req.body.annuncio.dateFrom],
                [req.body.annuncio.dateTo],
                [req.body.annuncio.n_bagni],
                [req.body.annuncio.n_posti],
                [req.body.annuncio.wifi],
                [req.body.annuncio.ascensore],
                [req.body.annuncio.garage],
                [req.body.annuncio.terrazzo],
                [req.body.annuncio.descrizione],
                [req.body.annuncio.telefono],
                [req.body.annuncio.costo],
                [req.body.annuncio.idAnnuncio]
            ])
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Annuncio modificato!`);
        res.send(results);
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
        console.log(req.body.ricerca.dateFrom)
        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT * FROM `annunci`\
            WHERE citta = ? AND n_posti >= ? AND dateFrom <= ? AND dateTo >= ?', [
                req.body.ricerca.citta,
                req.body.ricerca.n_ospiti,
                req.body.ricerca.dateFrom,
                req.body.ricerca.dateTo
            ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log(`Annunci a ${req.body.ricerca.citta} non trovati!`);
                res.status(403).send(`Annunci a ${req.body.ricerca.citta} non trovati!`);
            } else {
                console.log('Annunci Trovati');
                console.log(results);

                res.status(200).send(results);
            }
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function ricercaAnnunciProprietario(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT * FROM `annunci`\
            WHERE idProprietario = ?', [
                req.body.idProprietario
            ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log(`Annunci relativi all' ID ${req.body.idProprietario} non trovati!`);
                res.status(403).send(`Spiacenti, non ha annunci da modificare!`);
            } else {
                console.log('Annunci Trovati');
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