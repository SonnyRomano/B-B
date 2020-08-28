var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var dirImage = '../images/';
var multer = require('multer');

const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /gestioneAnnunci è vietata */
router.get('/', function (req, res, next) {
    next(createError(403));
});

// Opzioni di salvataggio per Multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = dirImage + 'ID' + req.body.idAnnuncio
        fs.mkdirSync(path, { recursive: true }) //recursive,permette di creare cartelle una dentro l'altra
        return cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })


/* Inserimento Immagini Annuncio */
router.post('/uploadImmaginiAnnuncio', upload.array('file', 12), async (req, res, next) => {
    const files = req.files
    console.log(files)
    console.log("Immagini Inserite!")
    if (!files) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send("Immagini Inserite!")
});

/* Ricerca Annunci */
router.post('/ricercaAnnunci', ricercaAnnunci);

/* Recupera Annuncio */
router.post('/recuperaAnnuncio', recuperaAnnuncio);

/* Inserimento Annuncio */
router.post('/inserisciAnnuncio', inserisciAnnuncio);

/* Aggiorna Annuncio dopo che il proprietario lo abbia modificato */
router.post('/aggiornaAnnuncio', aggiornaAnnuncio);

/* Elimina annuncio selezionato dal proprietario */
router.post('/eliminaAnnuncio', eliminaAnnuncio);

/* Ricerca Annunci proprietario */
router.post('/ricercaAnnunciProprietario', ricercaAnnunciProprietario);



// middleware di Inserimento Annuncio
async function inserisciAnnuncio(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        results = await db.query('INSERT INTO `annunci` \
          (idProprietario, citta, cap, indirizzo, dateFrom, dateTo, n_bagni, n_camere, n_letti, n_posti,\
             wifi, doccia, tv, cucina, riscaldamento, accessibile,\
             descrizione, titolo, costo) VALUES ?', [
            [
                [
                    req.body.annuncio.idProprietario,
                    req.body.annuncio.citta,
                    req.body.annuncio.cap,
                    req.body.annuncio.indirizzo,
                    req.body.annuncio.dateFrom,
                    req.body.annuncio.dateTo,
                    req.body.annuncio.n_bagni,
                    req.body.annuncio.n_camere,
                    req.body.annuncio.n_letti,
                    req.body.annuncio.n_posti,
                    req.body.annuncio.wifi,
                    req.body.annuncio.doccia,
                    req.body.annuncio.tv,
                    req.body.annuncio.cucina,
                    req.body.annuncio.riscaldamento,
                    req.body.annuncio.accessibile,
                    req.body.annuncio.descrizione,
                    req.body.annuncio.titolo,
                    req.body.annuncio.costo
                ]
            ]
        ])
            .catch(err => {
                throw err;
            });

        console.log(results.insertId);
        console.log(results);
        console.log(`Annuncio inserito!`);
        res.send(results);
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}


// middleware di recuperaAnnuncio
async function recuperaAnnuncio(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        await withTransaction(db, async () => {
            results = await db.query('SELECT * FROM `annunci`\
            WHERE idAnnuncio = ?', [
                req.body.id
            ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log(`Annuncio non trovato!`);
                res.status(403).send(`Annuncio non trovato!`);
            } else {
                console.log('Annuncio Trovato');
                console.log(results);

                res.status(200).send(results);
            }
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}


// middleware di elimina annuncio
async function eliminaAnnuncio(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        results = await db.query('DELETE FROM annunci \
                                  WHERE idAnnuncio = ? ',
            [
                req.body.idAnnuncio
            ])
            .catch(err => {
                throw err;
            });

        console.log(results);
        console.log(`Annuncio eliminato!`);

        fs.rmdirSync(dirImage + 'ID' + req.body.idAnnuncio, { recursive: true });

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