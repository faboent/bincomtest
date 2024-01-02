const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public')); // Assuming your static files (like CSS, images) are in the 'public' folder

// Route for the Home page
app.get('/', (req, res) => {
  res.render('home'); // Renders the home.ejs file from the 'views' folder
});

// Route for the Summed Results page
app.get('/summed', (req, res) => {
  res.render('summed'); // Renders the summedResults.ejs file from the 'views' folder
});

// Route for the Store Results page
app.get('/results', (req, res) => {
  res.render('results'); // Renders the storeResults.ejs file from the 'views' folder
});


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'faboent123',
  database: 'bincom',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch specific columns from announced_lga_results table
app.get('/data', (req, res) => {
  connection.query('SELECT party_abbreviation, party_score, entered_by_user, date_entered FROM announced_pu_results', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Sending retrieved data as JSON response
  });
});

app.get('/summed-results', (req, res) => {
    const selectedLocalGovt = req.query.localGovt;
  
    if (!selectedLocalGovt) {
      res.status(400).send('No local government selected');
      return;
    }
  
    connection.query(
      'SELECT apu.party_abbreviation, SUM(apu.party_score) as total_score FROM announced_pu_results apu JOIN announced_lga_results ot ON apu.party_abbreviation = ot.party_abbreviation AND ot.lga_name = ? GROUP BY apu.party_abbreviation',
      [selectedLocalGovt],
      (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.json(results); // Sending summed total result as JSON response
      }
    );
  });
  
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  

  app.post('/store-results', (req, res) => {
    const { partyAbbreviation, partyScore, enteredByUser, dateEntered, pollingUnitUniqueId } = req.body || {};
    
    const sql = `INSERT INTO announced_pu_results (polling_unit_uniqueid, party_abbreviation, party_score, entered_by_user, date_entered, user_ip_address) VALUES (8, 'ABC', 50, 'User123', '2024-01-02', '127.0.0.1')`;
  
    // Execute the SQL query with the array of values
    connection.query(sql, [pollingUnitUniqueId, partyAbbreviation, partyScore, enteredByUser, dateEntered], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error storing data');
        return;
      }
      console.log('Data inserted successfully!');
      res.status(200).send('Data inserted successfully!');
      
    });
  });
  
  


  
  // ... (other routes and server setup)
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
