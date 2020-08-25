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


// middleware di invio dati Questura
async function invioDatiQuestura(req, res, next) {

    console.log(req.body.dati.nomeCognome)

    res.status(200).send('Invio riuscito')

    /*const db = await makeDb(config);
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
    for(let i=0; i<dati.nomeCognome.lenght;i++)
    {
        textEmail += 'Ospite '+ i + ': ' + dati.nomeCognome[i]
    }

    var mailOptions = {
        attachments: [req.body.dati.formData.file]
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
        }
    });*/
}


// middleware di visualizzaPrenotazioniQuestura Annuncio
async function visualizzaPrenotazioniQuestura(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT * FROM `prenotazioni`\
            WHERE idProprietario = ? AND confermata = 1 AND questura = 0', [
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

module.exports = router;