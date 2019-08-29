const express = require('express');
// Note: To prossess the JSON requests
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const knex = require('knex');

// Imports .env vars
// npm install dotenv --save
require('dotenv').config();
// console.log(process.env.DB_PW);

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW || undefined,
    database: process.env.DB_DATABASE
  }
});

// db.select('*').from('users').then(
//   data => {
//     console.log(data);
//   }
// );


const app = express();
app.use(bodyParser.json());
// Note: npm install cors
app.use(cors());

// Fake DB
// Will send passwords via https
// Store Passords using bcrypt hash in DB
// npm install bcryptjs
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
  login: {
    id: '987',
    hash: '',
    email: 'john@gmail.com'
  }
}

// For checking Postman w/ 'localhost:3000/ ' & GET
app.get('/', (req, res) => {

  // res.send('this is working');
  res.send(database.users);

})

// For checking Postman w/ 'localhost:3000/signin ' & POST
// Note: Use of .json for built in stringify -- recieves JSON string in Postman
// Create access from signin w/req.body

// Test localhost:3000/signin POST raw JSON in BODY from Postman using
// {
//   'email': 'john@gmail.com',
//   'password': 'cookies'
// }
app.post('/signin', (req, res) => {

  // // Testing Ann Example on hash 

  // bcrypt.compare("apples", '$2a$10$QyLUjxejR.2.hAOXfHDXBgOWcJMcKsXu1Md7M8dvgN03mK', function(err, res) {
  //   console.log('first guess')
  // });

  // bcrypt.compare("whateverPassword", '$2a$10$jp7BFC3xR.2.hAOXfHDXBgOWcJMcKsXu1Md7M8dvgN03mK', function(err, res) {
  //   console.log('second guess')
  // });

  // Note: as of subsection 261, signin will only allow for first set user
  if(req.body.email == database.users[0].email &&
    req.body.password == database.users[0].password){

      res.json(database.users[0])
      // res.json('success');

  } else {

    res.status(400).json('error logging in');
  }

})


// Create a fake user
// Test localhost:3000/register POST raw JSON in BODY from Postman using
// {
//     "name": "Ann",
//     "email": "ann@gmail.com",
//     "password": "apples"
// }
app.post('/register', (req, res) => {

  const { name, email, password } = req.body;

  // Write to Database
  db('users')
  .returning('*')
  .insert({
    email: email,
    name: name,
    joined: new Date()
  }).then(user => {
    res.json(user[0]);
  })
  .catch(err => res.status(400).json('unable to register'))
})


// Create a fake user
// Test localhost:3000/profile/123 GET raw JSON in BODY from Postman using
app.get('/profile/:id', (req, res) => {

  const { id } = req.params;

  let found = false;
  db.select('*').from('users').where({id})
    .then(user => {
      if(user.length){
        res.json(user[0])
      } else{
        res.status(400).json('Not Found')
      }
      }).catch(err => res.status(400).json('Error getting user'))


  // if(!found){
  //     res.status(400).json('not found');
  //   }

})

// Post image
// Test localhost:3000/image POST raw JSON in BODY from Postman using
// Put request better for updating information
app.post('/image', (req, res) => {

  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id){
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if(!found){
      res.status(400).json('image not found');
  }
})




app.listen(5000, ()=> {

  console.log('API is running on port 5000');

})

/* Plan API

--> This is working
/signing --> POST = success/fail (want via https to prevent man in the middle)
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/
