const express = require('express');
const router = express.Router();

// Testing Bcrypt

const bcrypt = require('bcrypt');
const saltRounds = 10;

const {Pool, Client} = require('pg');

const client = new Client();

client.connect()
    .then(() => console.log("Postgres Connected ok, no errors"))
    // .then(() => client.query('SELECT f_name FROM users WHERE id = 1;'))
    // .then(results => console.log(results.rows))
    .catch(e => console.log);
    // .finally(()=> client.end());

// API Routes

router.post('/api/submit', (req, res) => {
  const { username, email_address, f_name, l_name, password } = req.body;
  const hashed_pw = bcrypt.hashSync(password, saltRounds);


  client.query('INSERT INTO users (username, email_address, f_name, l_name, password) VALUES($1, $2, $3, $4, $5);',
      [username, email_address, f_name, l_name, hashed_pw], (err, results) => {
        if (err) {
          console.log(err);
        }
      });
  console.log("User added, redirected to user List");
  res.redirect('/users');
});

router.post('/api/delete', (req, res) => {
  const id = parseInt(req.body.user);
  console.log(id);
  client.query('DELETE FROM users WHERE id = $1;', [id], (err) => {
    res.redirect('/users')
  })
});

/* Routes. */
router.get('/', function(req, res, next) {
    res.render( 'index', {
      title: 'Home Page'
    });
});

// Flebox fun route

router.get('/flexbox', ((req, res) => {
  res.render('flexbox');
}));

router.get('/users', (req, res) => {
  client.query('SELECT * FROM users ORDER BY id DESC LIMIT 10;', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.render('user_list',{
        user_obj: result.rows
      });
    }
  });
});

router.get('/users/:id', (req, res) => {

  const id = parseInt(req.params.id);

  if(!Number.isInteger(id)){
    res.json ({
      error: `Passed in argument: ${req.params.id}, could not be parsed as an int, please check your request`
    })
  } else {
    client.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
      if (err) {
        console.log(err)
      }
      if (results.rows.length === 0) {
        res.json({
          message: `No records found with user ID: ${id}`
        });
      } else {
        bcrypt.compare("fdgf", results.rows[0].password, function(err, pw_res) {
          if(pw_res) {
            res.json({
              data: results.rows,
              message: 'Passwords match!'
            });
          } else {
            res.json({
              data: results.rows,
              message: 'Password didnt match'
            });
          }
        });
      }
    });
  }
});




module.exports = router;
