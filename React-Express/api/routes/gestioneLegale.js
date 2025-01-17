var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /gestioneLegale è vietata */
router.get('/', function (req, res, next) {
    next(createError(403));
});


/* invio dati Questura */
router.post('/invioDatiQuestura', invioDatiQuestura);

/* lista prenotazioni Questura */
router.post('/visualizzaPrenotazioniQuestura', visualizzaPrenotazioniQuestura);

/* lista prenotazioni UfficioTurismo */
router.post('/rendicontaTasseSoggiorno', rendicontaTasseSoggiorno);

/* invia dati e paga tasse UfficioTurismo */
router.post('/pagaTasseSoggiorno', pagaTasseSoggiorno);


// middleware di invio dati Questura
async function invioDatiQuestura(req, res, next) {

    console.log(req.body.dati.nomeCognome)

    const db = await makeDb(config);
    let results = {};

    try {
        results = await db.query('UPDATE `prenotazioni` SET questura = 1 WHERE idPrenotazione = ?;',
            [
                req.body.dati.idPrenotazione,
            ]
        )
            .catch(err => {
                throw err;
            });

        console.log(results);
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

    var textEmail
    var dati = req.body.dati
    for (let i = 0; i < dati.nomeCognome.lenght; i++) {
        textEmail += 'Ospite ' + i + ': ' + dati.nomeCognome[i] + '\nCodice Fiscale: ' + dati.codiceFiscale[i] + '\n\n'
    }

    var mailOptions = {
        attachments: [req.body.dati.formData.file],
        from: 'teammars44@gmail.com',
        to: 'emailQuestura@questura.it',
        subject: 'Dati Ospiti',
        text: textEmail
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email inviata: ' + info.response);
            res.status(200).send('Invio riuscito')
        }
    });
}


// middleware di visualizzaPrenotazioniQuestura
async function visualizzaPrenotazioniQuestura(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT P.idPrenotazione, P.idAnnuncio, P.idProprietario, \
            P.idCliente, P.dateFrom, P.dateTo, P.costo, P.n_adulti, P.n_bambini, A.titolo, A.indirizzo, A.citta, A.cap\
            FROM `prenotazioni` P JOIN `annunci` A\
            WHERE P.idAnnuncio=A.idAnnuncio AND P.idProprietario = ? AND confermata = 1 AND questura = 0', [
                req.body.idProprietario
            ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log(`Prenotazioni relative all' ID ${req.body.idProprietario} non trovate!`);
                res.status(403).send(`Spiacenti, non ha prenotazioni da inviare alla Questura da visualizzare!`);
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

// middleware di rendiconta tasse di soggiorno per caricare tutte le prenotazioni attive di un singolo proprietario con id passato come parametro
async function rendicontaTasseSoggiorno(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};

    let mese;
    if (req.body.dataReq.mese <= 3) mese = '2020-12-31';
    else if (req.body.dataReq.mese <= 6) mese = '2020-3-31';
    else if (req.body.dataReq.mese <= 9) mese = '2020-6-30';
    else mese = '2020-9-30';

    console.log(mese)
    try {

        await withTransaction(db, async () => {
            results = await db.query('SELECT P.idPrenotazione, P.idAnnuncio, P.idProprietario, \
            P.idCliente, P.dateFrom, P.dateTo, P.n_adulti, P.n_bambini, P.costo, A.titolo, A.indirizzo, A.citta, A.cap, A.tassa\
            FROM `prenotazioni` P JOIN `annunci` A\
            WHERE P.idAnnuncio=A.idAnnuncio AND P.idProprietario = ? AND P.confermata = 1 AND P.ufficioTurismo = 0 AND P.dateTo <= ?', [
                req.body.dataReq.idProprietario,
                mese
            ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log(`Prenotazioni relative all' ID ${req.body.dataReq.idProprietario} non trovate!`);
                res.status(403).send(`Spiacenti, non ha prenotazioni per cui rendicontare le tasse di soggiorno!`);
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

// middleware di invio dati UfficioTurismo
async function pagaTasseSoggiorno(req, res, next) {

    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};

    let mese;
    if (req.body.dati.mese <= 3) mese = '2020-12-31';
    else if (req.body.dati.mese <= 6) mese = '2020-3-31';
    else if (req.body.dati.mese <= 9) mese = '2020-6-30';
    else mese = '2020-9-30';

    try {
        results = await db.query('UPDATE `prenotazioni` SET ufficioTurismo = 1 WHERE idProprietario = ? AND dateTo <= ?;',
            [
                req.body.dati.idProprietario,
                mese
            ]
        ).catch(err => {
            throw err;
        });


        var textEmail = '';
        var dati = req.body.dati;

        //Invio la mail all'ufficio turismo
        var transporter = nodemailer.createTransport({  //Variabili d'ambiente per permettere l'invio della mail da parte di nodemailer. 
            service: 'gmail',
            auth: {
                user: 'teammars44@gmail.com',  //Account gmail adhoc per inviare mail dal nostro sito
                pass: 'marspwd34'
            }
        });

        for (let i = 0; i < dati.nomeCognome.lenght; i++) {
            textEmail += 'Ospite ' + i + ': ' + dati.nomeCognome[i] + '\nCodice Fiscale: ' + dati.codiceFiscale[i] + '\n\n'
        };
        textEmail += 'Versamento effettuato ad ufficio turismo pari a ' + dati.versamento;

        textEmail += '\nDati Pagamento: ' + dati.cardname + ' - ' + dati.cardnumber + ' - ' + dati.expmonth + ' - ' + dati.expyear + ' - ' + dati.cvv;

        var mailOptions = {
            from: 'teammars44@gmail.com',
            to: 'maraglianofrancesco1@gmail.com',
            subject: 'Pagamento tasse di soggiorno',
            text: textEmail
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email inviata: ' + info.response);
            }
        });

        res.status(200).send(results)

    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

module.exports = router;