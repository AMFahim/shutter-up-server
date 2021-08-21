const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000


const app = express()
app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwf82.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const servicesCollection = client.db("shutterUp").collection("services");
  const ordersCollection = client.db("shutterUp").collection("orders");


  app.post ('/addOrders', (req, res) => {
    const newOrders = req.body;
    ordersCollection.insertOne(newOrders)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


  app.get('/orders', (req, res) => {
    ordersCollection.find()
    .toArray((err, orders) => {
      res.send(orders)
    })
  })

  
  // ------------Services-------------

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

  app.delete("/delete/:id", (req, res) => {
    servicesCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })



});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)