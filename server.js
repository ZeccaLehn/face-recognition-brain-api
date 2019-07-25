const express = require('express');
// Note: To prossess the JSON requests
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


// Fake DB
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
  ]
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

app.listen(3000, ()=> {

  console.log('app is running on port 3000');

});

/* Plan API

--> This is working
/signing --> POST = success/fail (want via https to prevent man in the middle)
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/
