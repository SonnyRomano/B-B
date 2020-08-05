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

/* Inserimento Annuncio */
router.post('/inserisciAnnuncio', inserisciAnnuncio);


// middleware di Inserimento Annuncio
async function inserisciAnnuncio(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {
        results = await db.query('INSERT INTO `annunci` \
          (idProprietario, citta, cap, indirizzo, civico, dateFrom, dateTo, n_bagni, n_posti, wifi, ascensore, garage, terrazzo, descrizione, telefono, costo) VALUES ?', [
            [
                [
                    req.body.annuncio.idProprietario,
                    req.body.annuncio.citta,
                    req.body.annuncio.cap,
                    req.body.annuncio.indirizzo,
                    req.body.annuncio.civico,
                    req.body.annuncio.dateFrom,
                    req.body.annuncio.dateTo,
                    req.body.annuncio.n_bagni,
                    req.body.annuncio.n_posti,
                    req.body.annuncio.wifi,
                    req.body.annuncio.ascensore,
                    req.body.annuncio.garage,
                    req.body.annuncio.terrazzo,
                    req.body.annuncio.descrizione,
                    req.body.annuncio.telefono,
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
                console.log(`Annunci a ${req.body.ricerca.citta} non trovati!`);
                res.status(403).send(`Annunci a ${req.body.ricerca.citta} non trovati!`);
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