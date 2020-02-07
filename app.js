const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common')); // let's see what 'common' format looks like

// JAngus: Per "Server-side programming with Node and Postgres" > 4. Working with the Express response object
// It said to 'npm install cors', and then add the following two lines.
// The curriculum also explained, "we can configure the server to set specific HTTP headers
// indicating to the browser that the server is willing to accept CORS requests." AND...
// "We can install and simply enable CORS for all requests for now."
const cors = require('cors');
app.use(cors());


const googapps = require('./googapps-data.js');

app.get('/apps', (req, res) => {
  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  const validSortKeys = ['rating', 'app'];
  
  const { genres = "", sort = "" } = req.query;

  if (sort) {
    if (!(validSortKeys.map(elem => elem.toLowerCase()).includes(sort.toLowerCase()))) {
      return res
        .status(400)
        .send('Sort must be one of ' + validSortKeys);
    }
  }

  if (genres) {
    if (!(validGenres.map(elem => elem.toLowerCase()).includes(genres.toLowerCase()))) {
      return res
        .status(400)
        .send('Genres must be one of ' + validGenres);
    }
  }

  let results = googapps
        .filter(oneApp =>
          oneApp
              .Genres
              .toLowerCase()
              .includes(genres.toLowerCase()));

  if (sort) {
    results
      .sort((a, b) => {
        let sortTerm = sort.charAt(0).toUpperCase() + sort.slice(1);
        return a[sortTerm] > b[sortTerm] ? 1 : a[sortTerm] < b[sortTerm] ? -1 : 0;
        //return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res
    .json(results);
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});
