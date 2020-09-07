var express = require('express')
var router = express.Router()

const { config } = require('../db/config');
const { makeDb } = require('../db/dbmiddleware');


async function insPagamento(req, res, next) {
    let query;
    let results = {};
    const db = await makeDb(config);

    try {

        //CREO TABELLA estremi_pagamento SE NON ESISTE
        query = 'CREATE TABLE IF NOT EXISTS estremi_pagamento \
        (`idPagamento` INT AUTO_INCREMENT PRIMARY KEY, `nome` VARCHAR(255), `email` VARCHAR(255), `indirizzo` VARCHAR(255),\
         `citta` VARCHAR(255), `provincia` VARCHAR(255), `cap` VARCHAR(255), `intestatario_carta` VARCHAR(255), `num_carta` VARCHAR(255),\
          `mese_scadenza` INT, `anno_scadenza` INT, `cvv` INT)'
        db.query(query, (err, result) => {
            if (err) throw err
            console.log(result);
        })

        //CREO TABELLA db_banca SE NON ESISTE
        query = 'CREATE TABLE IF NOT EXISTS db_banca (`idPagamento` INT PRIMARY KEY, `saldo` INT DEFAULT 500)'
        db.query(query, (err, result) => {
            if (err) throw err
            console.log(result);
        })

        //INSERISCO RECORD DENTRO LA TABELLA estremi_pagamenti
        results = await db.query('INSERT INTO `estremi_pagamento` \
          (nome, email, indirizzo, citta, provincia, cap, intestatario_carta, num_carta, mese_scadenza, anno_scadenza, cvv) VALUES ?',
            [
                [
                    [
                        req.body.pagamento.fname,
                        req.body.pagamento.email,
                        req.body.pagamento.adr,
                        req.body.pagamento.city,
                        req.body.pagamento.prov,
                        req.body.pagamento.cap,
                        req.body.pagamento.cardname,
                        req.body.pagamento.cardnumber,
                        req.body.pagamento.expmonth,
                        req.body.pagamento.expyear,
                        req.body.pagamento.cvv
                    ]
                ]
            ]).catch(err => {
                throw err;
            });

        //RECUPERO L'idPagamento DEL RECORD APPENA INSERITO NELLA TABELLA estremi_pagamento
        let idPagamento = results.insertId.toString();

        //INSERISCO RECORD DENTRO LA TABELLA db_banca PER SIMULARE SALDO CARTA IN BANCA
        //DI DEFAULT IN db_banca OGNI CARTA HA UN CREDITO DI 500 EURO INIZIALE
        db.query('INSERT INTO `db_banca` \
          (idPagamento) VALUES ?',
            [
                [
                    [
                        idPagamento,
                    ]
                ]
            ]).catch(err => {
                throw err;
            });

        console.log(idPagamento);
        console.log(results);
        console.log(`Estremo pagamento inserito!`);
        console.log(`Db_banca inserito!`);
        res.send(idPagamento);

    } catch (err) {
        console.log(err);
        next(createError(500));
    }

}

router.post('/insPagamento', insPagamento)

module.exports = router