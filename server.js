const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const uri =
  'mongodb+srv://shihabalam02:Shila84153@cluster0.8d7pms3.mongodb.net/?appName=mongosh+1.10.1';
const client = new MongoClient(uri, { useUnifiedTopology: true });

client
  .connect()
  .then(() => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    app.set('view engine', 'ejs');

    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.urlencoded({ extended: true })); // Add this line

    app.use(express.static('public'));

    app.use(bodyParser.json());

    app.delete('/quotes', (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete');
          }
          res.json(`Deleted Darth Vader's quote`);
        })
        .catch(error => console.error(error));
    });

    app.put('/quotes', (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: 'Yoda' },
          { $set: { name: req.body.name, quote: req.body.quote } },
          { upsert: true }
        )
        .then(result => {
          res.json('Success');
        })
        .catch(error => console.error(error));
    });

    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          console.log(result);
          res.redirect('/');
        })
        .catch(error => console.error(error));
    });

    app.get('/', (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then(results => {
          res.render('index', { quotes: results });
        })
        .catch(error => console.error(error));
    });

    app.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  })
  .catch(error => console.error(error));
