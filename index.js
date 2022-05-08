const express = require('express')
const app = express()
require('dotenv').config()
var cors = require('cors')
const port =process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

////
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.PRIVATE_KEY}:${process.env.PRIVATE_PASS}@cluster0.ha4fu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
     await client.connect()
     const collection = client.db('assignment').collection('services');
     const Mycollection = client.db('assignment').collection('my');
    //collection
     app.get('/email',async(req,res)=>{
      const email = req.query.email
      const query = {email:email}
      const cursor = Mycollection.find(query);
      const result =   await cursor.toArray();
      res.send(result)
    })
     app.get('/services',async(req,res)=>{
      const query = {}
      const cursor = collection.find(query);
      const result =   await cursor.toArray();
      res.send(result)
    })
     app.get('/services/:id',async(req,res)=>{
       const id = req.params.id;
       console.log(id)
       const query = {_id:ObjectId(id)}
       const result = await collection.findOne(query);
       res.send(result);

     })
     // get operation
     app.get('/email/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id:ObjectId(id)}
      const result = await Mycollection.findOne(query);
      res.send(result);

    })
     // delete operation
     app.delete('/services/:id',async(req,res)=>{
       const id = req.params.id;
       const query = {_id:ObjectId(id)}
       const result = await collection.deleteOne(query);
       res.send(result);
     })
     //by id
     app.delete('/email/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await Mycollection.deleteOne(query);
      res.send(result);
    })
     app.put('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const updatt = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updattdDoc = {
          $set: {
            SupplierName : updatt.SupplierName,
            description:updatt.description,
            quantity : updatt.quantity,
            price : updatt.price,
            picture : updatt.picture,
            Brand : updatt.Brand
          }
      };
      const result = await collection.updateOne(filter, updattdDoc, options);
      res.send(result);

  })
  app.post('/services/email',async(req,res)=>{
    const service = req.body;
    const result = await Mycollection.insertOne(service);
    res.send(result);
  })
 
     
  }

  
  finally{

  }
}
run().catch(console.dir)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

