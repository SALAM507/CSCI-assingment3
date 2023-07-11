const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()


MongoClient.connect('mongodb+srv://shihabalam02:Shila84153@cluster0.8d7pms3.mongodb.net/?appName=mongosh+1.10.1', {
    useUnifiedTopology: true 
}) 
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('random-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(bodyParser.json())
        app.get('/', (req,res) => {
            db.collection('quotes')
              .find()
              .sort({ _id: -1 })
              .toArray()
              .then(results => {
                res.render('index.ejs', { quotes: results })
              })
              .catch(error => console.error(error))
        })
        app.get('/quotes', (req, res) => {
            res.send('This is the GET route for /quotes');
        })
        app.post('/quotes', (req, res) => {
            quotesCollection
              .insertOne(req.body)
              .then(result => {
                res.redirect('/')
                console.log(result)
              })
              .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            console.log(req.body)
            quotesCollection
              .findOneAndUpdate(
                { name: 'Yoda' },
                {
                  $set: {
                    name: req.body.name,
                    quote: req.body.quote,
                  },
                },
                { upsert: true }
              )
              .then(result => {
                console.log(result);
                res.json('Success')
                // Additional code or response handling
              })
              .catch(error => console.error(error));  
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection
              .deleteOne({ name: req.body.name })
              .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                  }
                res.json(`Deleted Darth Vader's quote`)
              })
              .catch(error => console.error(error))
          })
        app.listen(3000, function () {
            console.log('listening on 3000')
        })
    })
    .catch(error => console.error(error))