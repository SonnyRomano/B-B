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

/* proprietario annulla prenotazione */
router.post('/annullaPrenotazione', annullaPrenotazione);

/* proprietario rifiuta prenotazione */
router.post('/confermaPrenotazione', confermaPrenotazione);

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
    console.log(req.body)
    const db = await makeDb(config);
    let results = {};

    //Accedo al dbms per eliminare la prenotazione dalla rispettiva tabella
    try {
        results = await db.query('DELETE FROM `prenotazioni` WHERE idPrenotazione = ?',
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

    //Accedo al dbms e recupero la mail del destinatario 
    try {
        results = await db.query('SELECT* FROM `utenti` WHERE id = ?;',
            [
                req.body.annullaP.idCliente,
            ]
        )
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Email destinatario recuperata!`);
    } catch (err) {
        console.log(err);
        next(createError(500));
    }

    //Invio la mail al destinatario 
    var transporter = nodemailer.createTransport({  //Variabili d'ambiente per permettere l'invio della mail da parte di nodemailer. 
        service: 'gmail',
        auth: {
            user: 'teammars44@gmail.com',  //Account gmail adhoc per inviare mail dal nostro sito
            pass: 'marspwd34'
        }
    });
    var mailOptions = {
        from: 'teammars44@gmail.com',
        to: results[0].email,   
        subject: 'Richiesta declinata!',
        text: 'Spiacente, il proprietario ha rifiutato la tua richiesta di prenotazione!'
    };
    transporter.sendMail(mailOptions, function (error, info) {    //Invio mail per notificare al cliente che il proprietario ha declinato la sua richiesta
        if (error) {
            console.log(error);
        } else {
            console.log('Email inviata: ' + info.response);
        }
    });
}

//Middleware conferma prenotazione
async function confermaPrenotazione(req, res, next) {
    console.log(req.body)
    const db = await makeDb(config);
    let results = {};

    //Accedo al dbms per settare ad attiva la prenotazione dalla rispettiva tabella
    try {
        results = await db.query('UPDATE `prenotazioni` SET attiva = 1 WHERE idPrenotazione = ?;',
            [
                req.body.annullaP.idPrenotazione,
            ]
        )
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Prenotazione impostata con flag attivo!`);
        res.send(results);
    } catch (err) {
        console.log(err);
        next(createError(500));
    }

    //Accedo al dbms e recupero la mail del destinatario 
    try {
        results = await db.query('SELECT* FROM `utenti` WHERE id = ?;',
            [
                req.body.annullaP.idCliente,
            ]
        )
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Email destinatario recuperata!`);
    } catch (err) {
        console.log(err);
        next(createError(500));
    }

    //Invio la mail al destinatario 
    var transporter = nodemailer.createTransport({  //Variabili d'ambiente per permettere l'invio della mail da parte di nodemailer. 
        service: 'gmail',
        auth: {
            user: 'teammars44@gmail.com',  //Account gmail adhoc per inviare mail dal nostro sito
            pass: 'marspwd34'
        }
    });
    var mailOptions = {
        from: 'teammars44@gmail.com',
        to: results[0].email,   
        subject: 'Richiesta accettata!',
        text: 'Complimenti! Il proprietario ha accettato la tua prenotazione, procederemo con la transazione!'
    };
    transporter.sendMail(mailOptions, function (error, info) {    //Invio mail per notificare al cliente che il proprietario ha declinato la sua richiesta
        if (error) {
            console.log(error);
        } else {
            console.log('Email inviata: ' + info.response);
        }
    });
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
            WHERE idProprietario = ? AND attiva = 0', [
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