const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpvz2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
  const database = client.db('tourNature');
  const bookingsCollection = database.collection('bookings');
  const servicesCollection = database.collection('services');
  //GET API for bookings
app.get('/bookings', async(req,res) =>{
  const cursor = bookingsCollection.find({});
  const bookings = await cursor.toArray(); 
  res.send(bookings);
});

//GET API for service
app.get('/services', async(req,res) =>{
  const cursor = servicesCollection.find({});
  const services = await cursor.toArray();
  res.send(services); 
});

  //POST API for bookings
app.post('/bookings', async(req, res) =>{
  const booking = req.body;
console.log('hit the post api', booking);

  const result = await bookingsCollection.insertOne(booking);
console.log(result);
res.json(result)
});

//POST API for services
app.post('/services', async(req,res) =>{
  const service = req.body;
  console.log('hit the post api', service);

  const result = await servicesCollection.insertOne(service);
  console.log(result);
  res.json(result);
});

//GET API for myorders
app.get("/bookings/:email", async (req, res) => {
  const email = req.params.email;
  const result = await bookingsCollection.find({ email: email }).toArray();
  res.json(result);
});

// Delete API
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await bookingsCollection.deleteOne(query);
  res.json(result);
});

  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Tour Nature62");
});

app.listen(port, () => {
  console.log("Running Tour Nature62 Server on port", port);
});
