const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000


const app = express()
app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwf82.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const servicesCollection = client.db("shutterUp").collection("services");


  app.post ('/addServices', (req, res) => {
    const newEvent = req.body;
    console.log(newEvent);
    servicesCollection.insertOne(newEvent)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })



});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)