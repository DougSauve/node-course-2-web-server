const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 4200;

var app = express();

//tell hbs we want to use partials (like header.hbs and footer.hbs)
hbs.registerPartials(__dirname + "/views/partials");

//tell express we want to use hbs
app.set('view engine', 'hbs');

//logs user visits to a text file with the date.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log ('unable to append to server.log');
    }
  });
  next();
})

// blocks off the site with a maintenance page.
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// })

//tell express we want to render a static website. This is middleware.
app.use(express.static(__dirname + "/public"));

//set up helpers, functions I can call in hbs files
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//give express new pages to render, pass in a 'variables' object
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'hey dude'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'unable to process request.'
  });
});

//get express to listen for requests
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
