var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /gestionePrenotazioni è vietata */
router.get('/', function (req, res, next) {
    next(createError(403));
});

/* clienti prenotano annunci */
router.post('/effettuaPrenotazione', effettuaPrenotazione);

/* clienti prenotano annunci */
router.post('/annullaPrenotazione', annullaPrenotazione);

/* proprietario visualiza lista prenotazioni pendenti */
router.post('/visualizzaPrenotazioniProprietario', visualizzaPrenotazioniProprietario);


// middleware di Inserimento Annuncio
async function effettuaPrenotazione(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        results = await db.query('INSERT INTO `prenotazioni` \
          (idAnnuncio, idProprietario, idCliente, dateFrom, dateTo, costo, idPagamento, attiva) VALUES ?', [
            [
                [
                    req.body.datiPrenotazione.idAnnuncio,
                    req.body.datiPrenotazione.idProprietario,
                    req.body.datiPrenotazione.idCliente,
                    req.body.datiPrenotazione.dateFrom,
                    req.body.datiPrenotazione.dateTo,
                    req.body.datiPrenotazione.costoTotale,
                    req.body.datiPrenotazione.idPagamento,
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

// middleware di annulla prenotazione
async function annullaPrenotazione(req, res, next) {
    const destinatario = '';

    // istanziamo il middleware per accedere al dbms e recuperare la mail del destinatario 
    const db = await makeDb(config);
    let results = {};
    try {
        results = await db.query('SElECT FROM `clienti`\
                    WHERE idCliente = ?',
            [
                req.body.annullaP.idCliente,
            ]
        )
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Email destinatario recuperata!`);
        destinatario = results[0].email;
    } catch (err) {
        console.log(err);
        next(createError(500));
    }

    var transporter = nodemailer.createTransport({  //Variabili d'ambiente per permettere l'invio della mail da parte di node. 
        service: 'gmail',
        auth: {
            user: 'teamMars@gmail.com',
            pass: 'marspwd'
        }
    });

    var mailOptions = {
        from: 'teamMars@gmail.com',
        to: destinatario,   //Destinatario da sistemare
        subject: 'Richiesta declinata!',
        text: 'Spiacente, il proprietario ha declinato la tua richiesta!'
    };

    transporter.sendMail(mailOptions, function (error, info) {    //Invio mail per notificare al cliente che il proprietario ha declinato la sua richiesta
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    try {
        results = await db.query('DELETE FROM `prenotazioni`\
                    WHERE idPrenotazione = ?',
            [
                req.body.annullaP.idPrenotazione,
            ]
        )
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Prenotazione eliminata!`);
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