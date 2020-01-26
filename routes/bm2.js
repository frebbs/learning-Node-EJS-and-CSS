const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const {Pool, Client} = require('pg');

const client = new Client();

client.connect()
    .then(() => console.log("Postgres Connected ok, no errors"))
    .catch(e => console.log);

/* POST users listing*/
router.post('/api/submit', (req, res) => {
  const { username, email_address, f_name, l_name, password } = req.body;
  const hashed_pw = bcrypt.hashSync(password, saltRounds);

    console.log(req.body);

  client.query('INSERT INTO bookmark_users (username, email_address, f_name, l_name, password) VALUES($1, $2, $3, $4, $5);',
      [username, email_address, f_name, l_name, hashed_pw], (err, results) => {
        if (err) {
          console.log(err);
        }
      });
  console.log("User added, redirected to user List");
  res.redirect('/bm2');
});

router.post('/api/login', (req, res) => {
    console.log(req.body);
    res.redirect('/bm2')
});

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('bm2/index')
});

router.get('/sign_in', function(req, res, next) {
    res.render('bm2/sign_in')
});

router.get('/users', (req, res) => {

    client.query('SELECT * FROM bookmark_users', (err, results) => {
        if (err) {
            console.log(err)
        }
        res.json({
            message: results.rows
        });
    });
});



module.exports = router;
