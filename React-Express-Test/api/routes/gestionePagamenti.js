const express = require('express')
// const app = express()
const router = express.Router()
const mysql = require('mysql');
const { config } = require('../db/config');
const { makeDb } = require('../db/dbmiddleware');


// app.get('/moduloPagamento', (req, res) => {
//     res.render('moduloPagamento')
// })

async function insPagamento(req, res, next) {
    // const db = mysql.createConnection(config)

    const db = await makeDb(config);

    let query = 'CREATE TABLE IF NOT EXISTS pagamenti(`id` INT AUTO_INCREMENT PRIMARY KEY, `fname` VARCHAR(255), `email` VARCHAR(255), `adr` VARCHAR(255), `city` VARCHAR(255), `prov` VARCHAR(255), `cap` VARCHAR(255))'

    db.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
        // res.send('TC')
    })

    let results = {};
    try {
        results = await db.query('INSERT INTO `pagamenti` \
          (fname, email, adr, city, prov, cap) VALUES ?', [
            [
                [
                    req.body.pagamento.fname,
                    req.body.pagamento.email,
                    req.body.pagamento.adr,
                    req.body.pagamento.city,
                    req.body.pagamento.prov,
                    req.body.pagamento.cap
                ]
            ]
        ]).catch(err => {
            throw err;
        });

        console.log(results.insertId);
        console.log(results);
        console.log(`Pagamento inserito!`);
        res.send(results);
    } catch (err) {
        console.log(err);
        next(createError(500));
    }


}

router.post('/insPagamento', insPagamento)

module.exports = router