const express = require('express');
// Note: To prossess the JSON requests
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');


const app = express();
app.use(bodyParser.json());

// Hashing passwords
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("hello", salt);

// bcrypt.hash('hello', 10, function(err, hash) {
//   console.log('check hash', hash);
// });


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

  // Testing Ann Example on hash 
  bcrypt.compare("apples", '$2a$10$QyLUjxejp7BFC3xR.2.hAOXfHDXBgOWcJMcKsXu1Md7M8dvgN03mK', function(err, res) {
    console.log('first guess')
  });

  bcrypt.compare("whateverPassword", '$2a$10$QyLUjxejp7BFC3xR.2.hAOXfHDXBgOWcJMcKsXu1Md7M8dvgN03mK', function(err, res) {
    console.log('second guess')
  });


  if(req.body.email == database.users[0].email &&
    req.body.password == database.users[0].password){

      res.json('success');

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

  // Output hash for testing 
  bcrypt.hash(password, 10, function(err, hash) {
    console.log('check hash', hash);
    });

  

  database.users.push({
      
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()

  })

  res.json(database.users[database.users.length - 1]);

})


// Create a fake user
// Test localhost:3000/profile/123 GET raw JSON in BODY from Postman using
app.get('/profile/:id', (req, res) => {

  const { id } = req.params;

  let found = false;
  database.users.forEach(user => {
    
    if(user.id === id){
      found = true;
      return res.json(user);
    }

  })

  if(!found){
      res.status(400).json('not found');
    }

})

// Post image
// Test localhost:3000/image POST raw JSON in BODY from Postman using
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




app.listen(3000, ()=> {

  console.log('app is running on port 3000');

})

/* Plan API

--> This is working
/signing --> POST = success/fail (want via https to prevent man in the middle)
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/
