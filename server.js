const express = require('express');

const app = express();

// For checking Postman w/ 'localhost:3000/ ' & GET
app.get('/', (req, res) => {
  res.send('this is working');
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
