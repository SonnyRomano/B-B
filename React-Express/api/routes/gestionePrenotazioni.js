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

/* proprietario visualiza visualizza Guadagno Proprietario */
router.post('/visualizzaGuadagnoProprietario', visualizzaGuadagnoProprietario);

/* recupera prenotazioni */
router.post('/recuperaPrenotazioni', recuperaPrenotazioni);



// middleware di effettua prenotazione
async function effettuaPrenotazione(req, res, next) {
    const db = await makeDb(config);
    let results = {};

    try {

        //CREO TABELLA prenotazioni SE NON ESISTE
        let query = 'CREATE TABLE IF NOT EXISTS prenotazioni \
                    (`idPrenotazione` INT AUTO_INCREMENT PRIMARY KEY, `idAnnuncio` INT, `idProprietario` INT, `idCliente` INT,\
                    `dateFrom` DATE, `dateTo` DATE, `costo` INT, `n_adulti` INT, `n_bambini` INT, `idPagamento` INT,\
                    `confermata` TINYINT(1), `questura` TINYINT(1), `ufficioTurismo` TINYINT(1) )'
        db.query(query, (err, result) => {
            if (err) throw err
            console.log(result);
        })

        results = await db.query('INSERT INTO `prenotazioni` \
          (idAnnuncio, idProprietario, idCliente, dateFrom, dateTo, costo, n_adulti, n_bambini, idPagamento, confermata, questura, ufficioTurismo) VALUES ?', [
            [
                [
                    req.body.datiPrenotazione.idAnnuncio,
                    req.body.datiPrenotazione.idProprietario,
                    req.body.datiPrenotazione.idCliente,
                    req.body.datiPrenotazione.dateFrom,
                    req.body.datiPrenotazione.dateTo,
                    req.body.datiPrenotazione.costoTotale,
                    req.body.datiPrenotazione.n_adulti,
                    req.body.datiPrenotazione.n_bambini,
                    req.body.datiPrenotazione.idPagamento,
                    false,
                    false,
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

    //Invio la mail al destinatario per comunicare che il proprietario ha rifiutato 
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
    const db = await makeDb(config);
    let results = {}; //Variabile per memorizzare la mail del cliente destinatario
    let mailProprietario = {} //Variabile per memorizzare mail del proprietario
    let saldo = {};
    let importo = {};
    let nuovoSaldo;

    //Recupero la mail del destinatario cui comunicherò l'esito della prenotazione
    try {
        results = await db.query('SELECT* FROM `utenti` WHERE id = ?;',
            [
                req.body.confermaP.idCliente,
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
    //Recupero la mail del proprietario cui comunicherò l'esito della prenotazione 
    try {
        mailProprietario = await db.query('SELECT* FROM `utenti` WHERE id = ?;',
            [
                req.body.confermaP.idProprietario,
            ]
        )
            .catch(err => {
                throw err;
            });

        console.log(mailProprietario);
        console.log(`Email proprietario recuperata!`);
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
    //Recupero il saldo corrente della carta specificata negli estremi di pagamento
    try {
        saldo = await db.query('SELECT* FROM `db_banca` WHERE idPagamento = ?;',
            [
                req.body.confermaP.idPagamento,
            ]
        ).catch(err => {
            throw err;
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
    //Recupero l'importo da pagare per la prenotazione effettuata
    try {
        importo = await db.query('SELECT* FROM `prenotazioni` WHERE idPrenotazione = ?;',
            [
                req.body.confermaP.idPrenotazione,
            ]
        ).catch(err => {
            throw err;
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }

    if (saldo[0].saldo >= importo[0].costo) { //SE IL SALDO NELLA CARTA E' SUFFICIENTE

        nuovoSaldo = saldo[0].saldo - importo[0].costo; //NUOVO SALDO DA AGGIORNARE DOPO TRANSAZIONE

        //Accedo al dbms per settare ad attiva la prenotazione dalla rispettiva tabella
        try {
            db.query('UPDATE `prenotazioni` SET confermata = 1 WHERE idPrenotazione = ?;',
                [
                    req.body.confermaP.idPrenotazione,
                ]
            )
                .catch(err => {
                    throw err;
                });

            console.log(`Prenotazione impostata con flag attivo!`);
        } catch (err) {
            console.log(err);
            next(createError(500));
        }

        //AGGIORNO IL SALDO DELLA CARTA DOPO LA TRANSAZIONE
        try {
            db.query('UPDATE `db_banca` SET saldo = ? WHERE idPagamento = ?;',
                [
                    nuovoSaldo,
                    req.body.confermaP.idPagamento,
                ]
            )
                .catch(err => {
                    throw err;
                });

            console.log(`Saldo della carta aggiornato!`);
            res.send(results);
        } catch (err) {
            console.log(err);
            next(createError(500));
        }

        //Invio la mail sia al destinatario che al proprietario per comunicare l'esito positivo del pagamento della prenotazione 
        var transporter = nodemailer.createTransport({  //Variabili d'ambiente per permettere l'invio della mail da parte di nodemailer. 
            service: 'gmail',
            auth: {
                user: 'teammars44@gmail.com',  //Account gmail adhoc per inviare mail dal nostro sito
                pass: 'marspwd34'
            }
        });
        var mailOptionsCliente = {  //DESTINATARIO CLIENTE
            from: 'teammars44@gmail.com',
            to: results[0].email,
            subject: 'Richiesta accettata!',
            text: 'Complimenti! Il pagamento è andato a buon fine, prenotazione completata!'
        };
        var mailOptionsProprietario = {  //DESTINATARIO PROPRIETARIO
            from: 'teammars44@gmail.com',
            to: mailProprietario[0].email,
            subject: 'Prenotazione andata a buon fine!',
            text: 'La prenotazione è stata completata con successo!'
        };
        transporter.sendMail(mailOptionsCliente, function (error, info) { //Invio mail per notificare al cliente che tutto è andato a buon fine
            if (error) {
                console.log(error);
            } else {
                console.log('Email inviata: ' + info.response);
            }
        });
        transporter.sendMail(mailOptionsProprietario, function (error, info) { //Invio mail per notificare al proprietario che il proprietario ha declinato la sua richiesta
            if (error) {
                console.log(error);
            } else {
                console.log('Email inviata: ' + info.response);
            }
        });
    }
    else //ALTRIMENTI SE IL SALDO NON E' SUFFICIENTE
    {
        //Accedo al dbms per eliminare la prenotazione dalla rispettiva tabella
        try {
            db.query('DELETE FROM `prenotazioni` WHERE idPrenotazione = ?',
                [
                    req.body.confermaP.idPrenotazione,
                ]
            )
                .catch(err => {
                    throw err;
                });

            console.log(`Prenotazione eliminata!`);
            res.send(results);
        } catch (err) {
            console.log(err);
            next(createError(500));
        }

        //Invio la mail al destinatario per comunicare che il proprietario ha accettato la prenotazione, ma il pagamento non è andato a buon fine
        var transporter = nodemailer.createTransport({  //Variabili d'ambiente per permettere l'invio della mail da parte di nodemailer. 
            service: 'gmail',
            auth: {
                user: 'teammars44@gmail.com',  //Account gmail adhoc per inviare mail dal nostro sito
                pass: 'marspwd34'
            }
        });
        var mailOptionsCliente = {
            from: 'teammars44@gmail.com',
            to: results[0].email,
            subject: 'Pagamento fallito!',
            text: 'Spiacente, il proprietario ha accettato la tua prenotazione ma il pagamento non è andato a buon fine, la prenotazione è stata eliminata!'
        };
        var mailOptionsProprietario = {
            from: 'teammars44@gmail.com',
            to: mailProprietario[0].email,
            subject: 'Pagamento fallito!',
            text: 'Spiacente, il pagamento non è andato a buon fine, la prenotazione è stata eliminata!'
        };
        transporter.sendMail(mailOptionsCliente, function (error, info) { //Invio mail per notificare al cliente che il pagamento non è andato a buon fine
            if (error) {
                console.log(error);
            } else {
                console.log('Email inviata: ' + info.response);
            }
        });
        transporter.sendMail(mailOptionsProprietario, function (error, info) { //Invio mail per notificare al proprietario che il pagamento non è andato a buon fine
            if (error) {
                console.log(error);
            } else {
                console.log('Email inviata: ' + info.response);
            }
        });
    }
}


// middleware di visualiza prenotazioni proprietario
async function visualizzaPrenotazioniProprietario(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT P.idPrenotazione, P.idAnnuncio, P.idProprietario, \
            P.idCliente, P.dateFrom, P.dateTo, P.costo, A.titolo, A.citta FROM `prenotazioni` P JOIN `annunci` A\
            WHERE P.idAnnuncio=A.idAnnuncio AND P.idProprietario = ? AND P.confermata = 0', [
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


// middleware di visualiza prenotazioni proprietario
async function visualizzaGuadagnoProprietario(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async () => {
            // inserimento utente
            results = await db.query('SELECT * FROM `prenotazioni`\
            WHERE idProprietario = ? AND confermata = 1', [
                req.body.idProprietario
            ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log(`Prenotazioni relative all' ID ${req.body.idProprietario} non trovate!`);
                res.status(403).send(`Errore`);
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


// middleware di recuperaAnnuncio
async function recuperaPrenotazioni(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        await withTransaction(db, async () => {
            results = await db.query('SELECT * FROM `prenotazioni`\
            WHERE idAnnuncio = ? AND confermata = 1', [
                req.body.id
            ])
                .catch(err => {
                    throw err;
                });

            console.log(results);

            res.status(200).send(results);
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

module.exports = router;